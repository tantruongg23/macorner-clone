import type { Route } from './+types/_index';
import { JsonLd } from '~/components/harpera/JsonLd';
import { CategoryIconRow } from '~/components/harpera/CategoryIconRow';
import { HeroBanner } from '~/components/harpera/HeroBanner';
import { SecondaryBanner } from '~/components/harpera/SecondaryBanner';
import { TrendingNow } from '~/components/harpera/TrendingNow';
import { CollectionTabsSection, type CollectionTabsSectionProps } from '~/components/harpera/CollectionTabsSection';
import { PhotoCategoryGrid } from '~/components/harpera/PhotoCategoryGrid';
import { PromoCTAGrid } from '~/components/harpera/PromoCTAGrid';
import { HappyCustomers } from '~/components/harpera/HappyCustomers';
import { PromoBar } from '~/components/harpera/PromoBar';
import { BackToTopButton } from '~/components/harpera/BackToTopButton';
import { SHOP_BY_RECIPIENT, SHOP_BY_PRODUCT, PROMO_CTA_ITEMS } from '~/lib/content';
import { CATEGORY_ICONS_QUERY } from '~/lib/graphql/categoryIcons';
import {HERO_BANNER_QUERY, HERO_CAROUSEL_QUERY} from '~/lib/graphql/heroBanner';
import type {HeroBannerData} from '~/components/harpera/HeroBanner';
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


function formatPrice(amount: string): string {
  // Always display as USD dollars since harpera.co is a USD store
  const parsed = parseFloat(amount);
  return `$${Number.isNaN(parsed) ? '0.00' : parsed.toFixed(2)}`;
}

export function meta() {
  const title = 'Harpera — Personalized Gifts & Custom Products';
  const description =
    'Shop personalized gifts, custom photo products, and unique presents for every occasion. Free shipping on orders over $75.';
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: 'https://harpera.co'},
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
      variables: {
        handle: COLLECTION_KEYS.BEST_SELLING,
        first: 8,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheLong(),
    }),
    storefront
      .query(HOME_CONTENT_QUERY, {
        variables: {
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      })
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
      price: formatPrice(p.priceRange.minVariantPrice.amount),
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
            price: formatPrice(p.priceRange.minVariantPrice.amount),
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
  name: 'Harpera',
  url: 'https://harpera.co',
  logo: 'https://harpera.co/cdn/shop/files/harpera-logo.png',
};

export default function Homepage({ loaderData }: Route.ComponentProps) {
  const bestSeller = loaderData.trendingProducts[0];
  const promoCTAItems = bestSeller
    ? [
        {
          title: 'Best Sellers',
          subtitle: 'Customer favorites, hand-picked for you',
          imageSrc: bestSeller.imageSrc,
          alt: bestSeller.alt,
          href: `/collections/${COLLECTION_KEYS.BEST_SELLING}`,
          cta: 'Best Selling',
        },
        ...PROMO_CTA_ITEMS,
      ]
    : PROMO_CTA_ITEMS;

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

      <PromoCTAGrid items={promoCTAItems} />

      <PhotoCategoryGrid title="Shop By Recipient" items={SHOP_BY_RECIPIENT} />
      <PhotoCategoryGrid title="Shop By Product" items={SHOP_BY_PRODUCT} />

      <HappyCustomers />
      <PromoBar />
      <BackToTopButton />
    </div>
  );
}
