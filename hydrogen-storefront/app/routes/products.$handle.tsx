import {redirect} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import type {Route} from './+types/products.$handle';
import {PRODUCT_QUERY, RELATED_PRODUCTS_QUERY} from '~/lib/graphql/product';
import {ProductGallery} from '~/components/macorner/ProductGallery';
import {ProductForm} from '~/components/macorner/ProductForm';
import {ProductReviews} from '~/components/macorner/ProductReviews';
import {ProductCard} from '~/components/macorner/ProductCard';

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

  const [{product}, relatedData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    }),
    storefront
      .query(RELATED_PRODUCTS_QUERY, {
        variables: {
          handle: 'best-selling',
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      })
      .catch(() => ({collection: null})),
  ]);

  if (!product) {
    throw new Response('Not Found', {status: 404});
  }

  const relatedProducts: Array<{
    id: string;
    title: string;
    handle: string;
    featuredImage?: {url: string; altText?: string | null | undefined} | null | undefined;
    priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
  }> =
    relatedData?.collection?.products?.nodes
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

export function meta({data}: Route.MetaArgs) {
  if (!data?.product) return [{title: 'Product Not Found'}];
  return [{title: data.product.title}];
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

  return (
    <div className="bg-white">
      <div className="container-macorner py-8 md:py-12">
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
