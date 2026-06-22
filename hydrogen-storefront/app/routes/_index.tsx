import type { Route } from './+types/_index';
import { JsonLd } from '~/components/harpera/JsonLd';
import { CategoryIconRow } from '~/components/harpera/CategoryIconRow';
// HeroBanner hidden for now — re-enable with the render below when carousel slides exist.
// import { HeroBanner } from '~/components/harpera/HeroBanner';
import { SecondaryBanner } from '~/components/harpera/SecondaryBanner';
import { TrendingNow } from '~/components/harpera/TrendingNow';
import { CollectionTabsSection, type CollectionTabsSectionProps } from '~/components/harpera/CollectionTabsSection';
import { PhotoCategoryGrid } from '~/components/harpera/PhotoCategoryGrid';
import { PromoCTAGrid } from '~/components/harpera/PromoCTAGrid';
import { HappyCustomers } from '~/components/harpera/HappyCustomers';
import { PromoBar } from '~/components/harpera/PromoBar';
import { BackToTopButton } from '~/components/harpera/BackToTopButton';
import { PROMO_CTA_ITEMS } from '~/lib/content';
import { SHOP_BY_SECTIONS_QUERY } from '~/lib/graphql/shopBySections';
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


// A field inside a referenced `link` metaobject. Holds either a product/collection
// reference, or an external URL stored as a `link`-type field (JSON `{text, url}`).
type LinkMetaobjectField = {
  key: string;
  value?: string | null | undefined;
  type?: string | null | undefined;
  reference?: { __typename?: string; handle?: string } | null | undefined;
};

// The resolved `action_resource` reference: a direct Product/Collection, or a
// nested `link` metaobject whose own fields point to the real destination.
type ActionResourceReference = {
  __typename?: string;
  handle?: string;
  type?: string | null | undefined;
  fields?: LinkMetaobjectField[] | null | undefined;
};

type HomeContentNode = {
  id: string;
  title?: { value?: string | null | undefined } | null | undefined;
  description?: { value?: string | null | undefined } | null | undefined;
  actionLabel?: { value?: string | null | undefined } | null | undefined;
  actionUrl?: { value?: string | null | undefined } | null | undefined;
  actionResource?: {
    value?: string | null | undefined;
    reference?: ActionResourceReference | null | undefined;
  } | null | undefined;
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


// Extract a usable URL from a `link`-type metaobject field value. Shopify stores
// these as JSON like `{"text":"...","url":"https://..."}`. Falls back to treating
// the raw value as a URL when it's already an absolute or root-relative path.
function urlFromExternalLinkValue(value?: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as {url?: unknown};
    if (typeof parsed?.url === 'string' && parsed.url) return parsed.url;
  } catch {
    // not JSON — fall through to treat the value itself as a URL
  }
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return value;
  return null;
}

// Resolve an `action_resource` metafield reference to a navigable link.
// Handles a direct Product/Collection reference, or a nested `link` metaobject
// whose own fields hold the real Product, Collection, or external URL.
function resolveActionResourceLink(
  ref: ActionResourceReference | null | undefined,
): string | null {
  if (!ref) return null;

  if (ref.__typename === 'Product' && ref.handle) return `/products/${ref.handle}`;
  if (ref.__typename === 'Collection' && ref.handle) return `/collections/${ref.handle}`;

  if (ref.fields) {
    for (const field of ref.fields) {
      const fieldRef = field.reference;
      if (fieldRef?.__typename === 'Product' && fieldRef.handle) {
        return `/products/${fieldRef.handle}`;
      }
      if (fieldRef?.__typename === 'Collection' && fieldRef.handle) {
        return `/collections/${fieldRef.handle}`;
      }
      const external = urlFromExternalLinkValue(field.value);
      if (external) return external;
    }
  }

  return null;
}

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
    shopBySectionsResult,
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
    storefront
      .query(SHOP_BY_SECTIONS_QUERY, { cache: storefront.CacheLong() })
      .catch(() => ({ shopByRecipient: null, shopByProduct: null })),
  ]);

  const categoryIcons = collections.nodes.filter(
    (col: { isMainCollection?: { value: string } | null }) =>
      col.isMainCollection?.value === 'true'
  );

  const bestSellingNode = bestSellingCollection;

  type SlideField = {
    key: string;
    value?: string | null;
    type?: string | null;
    reference?: {
      __typename?: string;
      handle?: string;
      type?: string | null;
      fields?: LinkMetaobjectField[] | null;
      image?: {url: string; altText?: string | null} | null;
    } | null;
  };

  function resolveActionLink(fields: SlideField[]): string {
    const resourceField = fields.find((f) => f.key === 'action_resource');
    const fromResource = resolveActionResourceLink(resourceField?.reference);
    if (fromResource) return fromResource;

    const urlField = fields.find((f) => f.key === 'action_url');
    return urlField?.value ?? '#';
  }

  function extractSlide(node: {fields: SlideField[]}): HeroBannerData {
    const plainFields: Record<string, string> = {};
    let image: {url: string; altText?: string | null} | null = null;
    for (const field of node.fields) {
      if (field.key === 'image' && field.reference?.image) {
        image = field.reference.image;
      } else if (field.value) {
        plainFields[field.key] = field.value;
      }
    }
    return {
      title: plainFields.title ?? '',
      description: plainFields.description ?? '',
      actionLink: resolveActionLink(node.fields),
      actionLabel: plainFields.action_label,
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
      if (field.key === 'image' && field.reference?.__typename === 'MediaImage') {
        secondaryImage = field.reference.image ?? null;
      } else if (field.value) {
        secondaryFields[field.key] = field.value;
      }
    }
    secondaryBanner = {
      title: secondaryFields.title ?? '',
      description: secondaryFields.description ?? '',
      actionLink: resolveActionLink(secondaryNode.fields),
      actionLabel: secondaryFields.action_label,
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
        // Only surface collections that actually have products — empty tabs
        // are a dead end for shoppers (matches macorner.co behavior).
        .filter((col) => (col.products?.nodes?.length ?? 0) > 0)
        .map((col) => ({
          label: col.title,
          href: `/collections/${col.handle}`,
          products: col.products.nodes.map((p) => ({
            title: p.title,
            href: `/products/${p.handle}`,
            imageSrc: p.featuredImage?.url ?? '',
            alt: p.featuredImage?.altText ?? p.title,
            price: formatPrice(p.priceRange.minVariantPrice.amount),
          })),
        }));

      const actionLink =
        resolveActionResourceLink(node.actionResource?.reference) ??
        node.actionUrl?.value ??
        '#';

      return {
        id: node.id,
        bannerTitle: title,
        bannerSubtitle: node.description?.value ?? '',
        bannerImageSrc: node.image?.reference?.image?.url ?? '',
        bannerImageAlt: node.image?.reference?.image?.altText ?? title,
        bannerImageSide: (index % 2 === 0 ? 'right' : 'left') as 'left' | 'right',
        actionLink,
        actionLabel: node.actionLabel?.value ?? undefined,
        tabs,
      };
    }
  );

  type ShopByCollectionNode = {
    title: string;
    handle: string;
    image?: {url: string; altText?: string | null} | null;
  };

  type ShopBySectionRaw = {
    title?: {value?: string | null} | null;
    subtitle?: {value?: string | null} | null;
    background_color?: {value?: string | null} | null;
    image_style?: {value?: string | null} | null;
    card_style?: {value?: string | null} | null;
    columns?: {value?: string | null} | null;
    collections?: {references?: {nodes: ShopByCollectionNode[]} | null} | null;
  } | null;

  function extractShopBySection(raw: ShopBySectionRaw, defaultTitle: string) {
    const items = (raw?.collections?.references?.nodes ?? []).map((col) => ({
      label: col.title,
      href: `/collections/${col.handle}`,
      imageSrc: col.image?.url ?? '',
      alt: col.image?.altText ?? col.title,
    }));
    return {
      title: raw?.title?.value ?? defaultTitle,
      subtitle: raw?.subtitle?.value ?? null,
      backgroundColor: raw?.background_color?.value ?? null,
      imageStyle: (raw?.image_style?.value ?? 'circle') as 'circle' | 'square',
      cardStyle: raw?.card_style?.value ?? null,
      columns: raw?.columns?.value ? parseInt(raw.columns.value, 10) : null,
      items,
    };
  }

  const shopByRecipient = extractShopBySection(
    shopBySectionsResult?.shopByRecipient ?? null,
    'Shop By Recipient',
  );
  const shopByProduct = extractShopBySection(
    shopBySectionsResult?.shopByProduct ?? null,
    'Shop By Product',
  );

  return {
    categoryIcons,
    heroSlides,
    secondaryBanner,
    trendingProducts,
    homeContentSections,
    shopByRecipient,
    shopByProduct,
  };
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
      {/* HeroBanner hidden until we have carousel slides to display.
          Re-enable when hero_banner metaobjects are populated. */}
      {/* <HeroBanner slides={loaderData.heroSlides} /> */}
      <SecondaryBanner data={loaderData.secondaryBanner} />
      <TrendingNow products={loaderData.trendingProducts} />

      <div className="flex flex-col ">
        {(loaderData.homeContentSections as HomeContentSectionItem[]).map(
          ({id, ...section}) => (
            <CollectionTabsSection key={id} {...section} />
          ),
        )}
      </div>

      <PhotoCategoryGrid
        title={loaderData.shopByRecipient.title}
        subtitle={loaderData.shopByRecipient.subtitle ?? undefined}
        items={loaderData.shopByRecipient.items}
        imageStyle={loaderData.shopByRecipient.imageStyle}
        cardStyle={loaderData.shopByRecipient.cardStyle ?? undefined}
        backgroundColor={loaderData.shopByRecipient.backgroundColor ?? undefined}
        columns={loaderData.shopByRecipient.columns ?? undefined}
      />
      <PhotoCategoryGrid
        title={loaderData.shopByProduct.title}
        subtitle={loaderData.shopByProduct.subtitle ?? undefined}
        items={loaderData.shopByProduct.items}
        imageStyle={loaderData.shopByProduct.imageStyle}
        cardStyle={loaderData.shopByProduct.cardStyle ?? undefined}
        backgroundColor={loaderData.shopByProduct.backgroundColor ?? undefined}
        columns={loaderData.shopByProduct.columns ?? undefined}
      />

      <HappyCustomers />
      <PromoBar />
      <BackToTopButton />
    </div>
  );
}
