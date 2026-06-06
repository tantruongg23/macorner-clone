import type { Route } from './+types/_index';
import { JsonLd } from '~/components/macorner/JsonLd';
import { CategoryIconRow } from '~/components/macorner/CategoryIconRow';
import { HeroBanner } from '~/components/macorner/HeroBanner';
import { SecondaryBanner } from '~/components/macorner/SecondaryBanner';
import { TrendingNow } from '~/components/macorner/TrendingNow';
import { CollectionTabsSection, type CollectionTabsSectionProps } from '~/components/macorner/CollectionTabsSection';
import { PhotoCategoryGrid } from '~/components/macorner/PhotoCategoryGrid';
import { HappyCustomers } from '~/components/macorner/HappyCustomers';
import { PromoBar } from '~/components/macorner/PromoBar';
import { BackToTopButton } from '~/components/macorner/BackToTopButton';
import { SHOP_BY_RECIPIENT, SHOP_BY_PRODUCT } from '~/lib/content';
import { CATEGORY_ICONS_QUERY } from '~/lib/graphql/categoryIcons';
import {HERO_BANNER_QUERY, HERO_CAROUSEL_QUERY} from '~/lib/graphql/heroBanner';
import type {HeroBannerData} from '~/components/macorner/HeroBanner';
import { COLLECTION_PRODUCTS_BY_KEY_QUERY } from '~/lib/graphql/collection';
import { HOME_CONTENT_QUERY } from '~/lib/graphql/homeContent';
import { COLLECTION_KEYS } from '~/lib/constants';

type HomeContentSectionItem = CollectionTabsSectionProps & {id: string};

type StorefrontProduct = {
  id: string;
  title: string;
  handle: string;
  featuredImage?: { url: string; altText?: string | null | undefined } | null | undefined;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};


type HomeContentNode = {
  id: string;
  title?: { value?: string | null | undefined } | null | undefined;
  description?: { value?: string | null | undefined } | null | undefined;
  actionLink?: { value?: string | null | undefined } | null | undefined;
  image?: {
    reference?: { image?: { url: string; altText?: string | null | undefined } | null | undefined } | null | undefined;
  } | null | undefined;
  collections?: {
    references?: {
      nodes: {
        title: string;
        handle: string;
        products: { nodes: StorefrontProduct[] };
      }[];
    } | null | undefined;
  } | null | undefined;
};


function formatPrice(amount: string, currencyCode: string): string {
  const parsed = parseFloat(amount);
  return `$${Number.isNaN(parsed) ? '0.00' : parsed.toFixed(2)} ${currencyCode}`;
}

export function meta() {
  const title = 'Macorner — Personalized Gifts & Custom Products';
  const description =
    'Shop personalized gifts, custom photo products, and unique presents for every occasion. Free shipping on orders over $75.';
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: 'https://macorner.co'},
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const [
    { collections },
    { metaobjects },
    { collection: bestSellingCollection },
    { metaobjects: homeContentMetaobjects },
    { metaobjects: heroCarouselMetaobjects },
  ] = await Promise.all([
    storefront.query(CATEGORY_ICONS_QUERY, { cache: storefront.CacheLong() }),
    storefront.query(HERO_BANNER_QUERY, { cache: storefront.CacheLong() }),
    storefront.query(COLLECTION_PRODUCTS_BY_KEY_QUERY, {
      variables: { handle: COLLECTION_KEYS.BEST_SELLING, first: 8 },
      cache: storefront.CacheLong(),
    }),
    storefront
      .query(HOME_CONTENT_QUERY, { cache: storefront.CacheShort() })
      .catch(() => ({ metaobjects: null })),
    storefront
      .query(HERO_CAROUSEL_QUERY, { cache: storefront.CacheLong() })
      .catch(() => ({ metaobjects: null })),
  ]);

  const categoryIcons = collections.nodes.filter(
    (col: { isMainCollection?: { value: string } | null }) =>
      col.isMainCollection?.value === 'true'
  );

  const bestSellingNode = bestSellingCollection;

  function extractSlide(node: {fields: {key: string; value: string | null; reference?: {image?: {url: string; altText?: string | null} | null} | null}[]}): HeroBannerData {
    const fields: Record<string, string> = {};
    let image: {url: string; altText?: string | null} | null = null;
    for (const field of node.fields) {
      if (field.key === 'image' && field.reference?.image) {
        image = field.reference.image;
      } else if (field.value) {
        fields[field.key] = field.value;
      }
    }
    return {
      title: fields.title ?? '',
      description: fields.description ?? '',
      actionLink: fields.action_link ?? '#',
      image,
    };
  }

  const carouselNodes = heroCarouselMetaobjects?.nodes ?? [];
  const heroSlides: HeroBannerData[] =
    carouselNodes.length > 0
      ? carouselNodes.map(extractSlide)
      : metaobjects?.nodes?.[0]
      ? [extractSlide(metaobjects.nodes[0])]
      : [];

  const secondaryNode = metaobjects?.nodes?.[1];
  let secondaryBanner = null;
  if (secondaryNode) {
    const secondaryFields: Record<string, string> = {};
    let secondaryImage: {url: string; altText?: string | null | undefined} | null = null;
    for (const field of secondaryNode.fields) {
      if (field.key === 'image' && field.reference?.image) {
        secondaryImage = field.reference.image;
      } else if (field.value) {
        secondaryFields[field.key] = field.value;
      }
    }
    secondaryBanner = {
      title: secondaryFields.title ?? '',
      description: secondaryFields.description ?? '',
      actionLink: secondaryFields.action_link ?? '#',
      image: secondaryImage,
    };
  }

  const trendingProducts = (bestSellingNode?.products?.nodes ?? []).map(
    (p: StorefrontProduct) => ({
      title: p.title,
      href: `/products/${p.handle}`,
      imageSrc: p.featuredImage?.url ?? '',
      alt: p.featuredImage?.altText ?? p.title,
      price: formatPrice(
        p.priceRange.minVariantPrice.amount,
        p.priceRange.minVariantPrice.currencyCode,
      ),
    })
  );

  const homeContentSections = (homeContentMetaobjects?.nodes ?? []).map(
    (node: HomeContentNode, index: number) => {
      const title = node.title?.value ?? '';
      const tabs = (node.collections?.references?.nodes ?? [])
        .filter((col) => col.products != null)
        .map((col) => ({
          label: col.title,
          products: col.products.nodes.map((p) => ({
            title: p.title,
            href: `/products/${p.handle}`,
            imageSrc: p.featuredImage?.url ?? '',
            alt: p.featuredImage?.altText ?? p.title,
            price: formatPrice(
              p.priceRange.minVariantPrice.amount,
              p.priceRange.minVariantPrice.currencyCode,
            ),
          })),
        }));

      return {
        id: node.id,
        bannerTitle: title,
        bannerSubtitle: node.description?.value ?? '',
        bannerImageSrc: node.image?.reference?.image?.url ?? '',
        bannerImageAlt: node.image?.reference?.image?.altText ?? title,
        bannerImageSide: (index % 2 === 0 ? 'right' : 'left') as 'left' | 'right',
        actionLink: node.actionLink?.value ?? '#',
        tabs,
      };
    }
  );

  return {categoryIcons, heroSlides, secondaryBanner, trendingProducts, homeContentSections};
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Macorner',
  url: 'https://macorner.co',
  logo: 'https://macorner.co/cdn/shop/files/macorner-logo.png',
};

export default function Homepage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <JsonLd data={ORGANIZATION_JSON_LD} />
      <CategoryIconRow collections={loaderData.categoryIcons} />
      <HeroBanner slides={loaderData.heroSlides} />
      <SecondaryBanner data={loaderData.secondaryBanner} />
      <TrendingNow products={loaderData.trendingProducts} />

      <div className="flex flex-col gap-8 md:gap-16">
        {(loaderData.homeContentSections as HomeContentSectionItem[]).map(
          ({id, ...section}) => (
            <CollectionTabsSection key={id} {...section} />
          ),
        )}
      </div>

      <PhotoCategoryGrid title="Shop By Recipient" items={SHOP_BY_RECIPIENT} />
      <PhotoCategoryGrid title="Shop By Product" items={SHOP_BY_PRODUCT} />

      <HappyCustomers />
      <PromoBar />
      <BackToTopButton />
    </div>
  );
}
