import {redirect} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import type {Route} from './+types/products.$handle';
import {PRODUCT_QUERY, PRODUCT_RECOMMENDATIONS_QUERY} from '~/lib/graphql/product';
import {ProductGallery} from '~/components/macorner/ProductGallery';
import {ProductForm} from '~/components/macorner/ProductForm';
import {ProductReviews} from '~/components/macorner/ProductReviews';
import {ProductCard} from '~/components/macorner/ProductCard';
import {Breadcrumb} from '~/components/macorner/Breadcrumb';
import {SimilarCategories} from '~/components/macorner/SimilarCategories';
import {JsonLd} from '~/components/macorner/JsonLd';

export async function loader({params, request, context}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Response('Not Found', {status: 404});
  }

  const url = new URL(request.url);
  const selectedOptions = [...url.searchParams.entries()].map(
    ([name, value]) => ({name, value}),
  );

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    }),
  ]);

  if (!product) {
    throw new Response('Not Found', {status: 404});
  }

  // Fetch recommendations using the resolved product GID
  const recommendationsData = await storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      variables: {
        productId: product.id,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    })
    .catch(() => ({productRecommendations: null}));

  const relatedProducts: Array<{
    id: string;
    title: string;
    handle: string;
    featuredImage?: {url: string; altText?: string | null | undefined} | null | undefined;
    priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
  }> =
    recommendationsData?.productRecommendations
      ?.filter((p: {id: string}) => p.id !== product.id)
      ?.slice(0, 4) ?? [];

  if (!product.selectedVariant && product.variants.nodes.length > 0) {
    const firstAvailableVariant =
      product.variants.nodes.find(
        (v: {availableForSale: boolean}) => v.availableForSale,
      ) ?? product.variants.nodes[0];
    const redirectParams = new URLSearchParams(url.searchParams);
    firstAvailableVariant.selectedOptions.forEach(
      (opt: {name: string; value: string}) => {
        redirectParams.set(opt.name, opt.value);
      },
    );
    throw redirect(`/products/${handle}?${redirectParams.toString()}`);
  }

  return {product, relatedProducts};
}

export function meta({data, location}: Route.MetaArgs) {
  if (!data?.product) return [{title: 'Product Not Found'}];
  const {product} = data;
  const title = product.seo?.title ?? `${product.title} — Macorner`;
  const description =
    product.seo?.description ??
    (product.description ? product.description.slice(0, 155) : '');
  const ogImage = product.images?.nodes?.[0]?.url;
  const canonical = `https://macorner.co${location.pathname}`;

  return [
    {title},
    ...(description ? [{name: 'description', content: description}] : []),
    {property: 'og:title', content: title},
    {property: 'og:type', content: 'product'},
    {property: 'og:url', content: canonical},
    ...(description
      ? [{property: 'og:description', content: description}]
      : []),
    ...(ogImage ? [{property: 'og:image', content: ogImage}] : []),
    {tagName: 'link', rel: 'canonical', href: canonical},
  ];
}

export default function ProductPage({loaderData}: Route.ComponentProps) {
  const {product, relatedProducts} = loaderData;
  const selectedVariant =
    product.selectedVariant ?? product.variants.nodes[0] ?? null;

  const wishlistProduct = {
    handle: product.handle,
    title: product.title,
    image:
      selectedVariant?.image?.url ??
      product.images?.nodes?.[0]?.url ??
      undefined,
    price: selectedVariant?.price
      ? `$${parseFloat(selectedVariant.price.amount).toFixed(2)}`
      : undefined,
  };

  const primaryCollection = product.collections?.nodes?.[0];
  const breadcrumbItems = [
    {label: 'Home', href: '/'},
    ...(primaryCollection
      ? [{label: primaryCollection.title, href: `/collections/${primaryCollection.handle}`}]
      : []),
    {label: product.title},
  ];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? '',
    image: product.images?.nodes?.map((img: {url: string}) => img.url) ?? [],
    brand: {'@type': 'Brand', name: product.vendor ?? 'Macorner'},
    offers: selectedVariant
      ? {
          '@type': 'Offer',
          // Always USD since macorner.co displays prices as USD dollars
          priceCurrency: 'USD',
          price: selectedVariant.price.amount,
          availability: selectedVariant.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? {item: `https://macorner.co${item.href}`} : {}),
    })),
  };

  const similarCategories = (product.collections?.nodes ?? []) as Array<{
    title: string;
    handle: string;
    image?: {url: string; altText?: string | null} | null;
  }>;

  return (
    <div className="bg-white">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container-macorner py-8 md:py-12">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="md:sticky md:top-8 self-start">
            <ProductGallery
              images={product.images.nodes}
              selectedVariantImage={selectedVariant?.image}
              wishlistProduct={wishlistProduct}
            />
          </div>

          {/* Product info */}
          <ProductForm product={product} selectedVariant={selectedVariant} />
        </div>

        {/* Judge.me reviews widget */}
        <ProductReviews productId={product.id} productHandle={product.handle} />

        {/* Similar Categories */}
        <SimilarCategories categories={similarCategories} />

        {/* More Items to Consider */}
        {relatedProducts.length > 0 && <MoreItems products={relatedProducts} />}
      </div>

      {selectedVariant && (
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant.price.amount,
                vendor: product.vendor,
                variantId: selectedVariant.id,
                variantTitle: selectedVariant.selectedOptions
                  .map((o: {name: string; value: string}) => o.value)
                  .join(' / '),
                quantity: 1,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

interface RelatedProduct {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {url: string; altText?: string | null | undefined} | null | undefined;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
}

function MoreItems({products}: {products: RelatedProduct[]}) {
  return (
    <section className="mt-14 pt-10 border-t border-[rgba(18,18,18,0.08)]">
      <h2 className="text-lg font-semibold text-[rgb(18,18,18)] mb-6">
        More Items to Consider
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={{
              id: item.id,
              handle: item.handle,
              title: item.title,
              price: `$${parseFloat(item.priceRange.minVariantPrice.amount).toFixed(2)}`,
              imageSrc: item.featuredImage?.url ?? '',
              href: `/products/${item.handle}`,
              alt: item.featuredImage?.altText ?? item.title,
            }}
          />
        ))}
      </div>
    </section>
  );
}
