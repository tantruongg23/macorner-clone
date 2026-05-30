import type { Route } from './+types/_index';
import { CategoryIconRow } from '~/components/macorner/CategoryIconRow';
import { HeroBanner } from '~/components/macorner/HeroBanner';
import { TrendingNow } from '~/components/macorner/TrendingNow';
import { CollectionTabsSection } from '~/components/macorner/CollectionTabsSection';
import { PhotoCategoryGrid } from '~/components/macorner/PhotoCategoryGrid';
import { HappyCustomers } from '~/components/macorner/HappyCustomers';
import { PromoBar } from '~/components/macorner/PromoBar';
import { BackToTopButton } from '~/components/macorner/BackToTopButton';
import { SHOP_BY_RECIPIENT, SHOP_BY_PRODUCT } from '~/lib/content';
import { CATEGORY_ICONS_QUERY } from '~/lib/graphql/categoryIcons';
import { HERO_BANNER_QUERY } from '~/lib/graphql/heroBanner';
import { COLLECTION_PRODUCTS_BY_KEY_QUERY } from '~/lib/graphql/collection';
import { HOME_CONTENT_QUERY } from '~/lib/graphql/homeContent';
import { COLLECTION_KEYS } from '~/lib/constants';

type StorefrontProduct = {
  id: string;
  title: string;
  handle: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

type HomeContentNode = {
  id: string;
  title: { value: string | null } | null;
  description: { value: string | null } | null;
  actionLink: { value: string | null } | null;
  image: {
    reference: { image: { url: string; altText: string | null } } | null;
  } | null;
  collections: {
    references: {
      nodes: {
        title: string;
        handle: string;
        products: { nodes: StorefrontProduct[] };
      }[];
    } | null;
  } | null;
};

function formatPrice(amount: string, currencyCode: string): string {
  const parsed = parseFloat(amount);
  return `$${Number.isNaN(parsed) ? '0.00' : parsed.toFixed(2)} ${currencyCode}`;
}

export async function loader({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const [
    { collections },
    { metaobjects },
    { collection: bestSellingCollection },
    { metaobjects: homeContentMetaobjects },
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
  ]);

  const categoryIcons = collections.nodes.filter(
    (col: { isMainCollection?: { value: string } | null }) =>
      col.isMainCollection?.value === 'true'
  );

  const heroFields: Record<string, string> = {};
  let heroImage: { url: string; altText: string | null } | null = null;
  const bestSellingNode = bestSellingCollection;

  const heroNode = metaobjects?.nodes?.[0];
  if (heroNode) {
    for (const field of heroNode.fields) {
      if (field.key === 'image' && field.reference?.image) {
        heroImage = field.reference.image;
      } else if (field.value) {
        heroFields[field.key] = field.value;
      }
    }
  }

  const heroBanner = heroNode
    ? {
        title: heroFields.title ?? '',
        description: heroFields.description ?? '',
        actionLink: heroFields.action_link ?? '#',
        image: heroImage,
      }
    : null;

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

  return { categoryIcons, heroBanner, trendingProducts, homeContentSections };
}

export default function Homepage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CategoryIconRow collections={loaderData.categoryIcons} />
      <HeroBanner data={loaderData.heroBanner} />
      <TrendingNow products={loaderData.trendingProducts} />

      <div className="flex flex-col gap-8 md:gap-16">
        {loaderData.homeContentSections.map(({id, ...section}) => (
          <CollectionTabsSection key={id} {...section} />
        ))}
      </div>

      <PhotoCategoryGrid title="Shop By Recipient" items={SHOP_BY_RECIPIENT} />
      <PhotoCategoryGrid title="Shop By Product" items={SHOP_BY_PRODUCT} />

      <HappyCustomers />
      <PromoBar />
      <BackToTopButton />
    </div>
  );
}
