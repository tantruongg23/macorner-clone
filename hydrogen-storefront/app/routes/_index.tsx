import type { Route } from './+types/_index';
import { CategoryIconRow } from '~/components/macorner/CategoryIconRow';
import { HeroBanner } from '~/components/macorner/HeroBanner';
import { TrendingNow } from '~/components/macorner/TrendingNow';
import { CollectionTabsSection } from '~/components/macorner/CollectionTabsSection';
import { PhotoCategoryGrid } from '~/components/macorner/PhotoCategoryGrid';
import { HappyCustomers } from '~/components/macorner/HappyCustomers';
import { PromoBar } from '~/components/macorner/PromoBar';
import { BackToTopButton } from '~/components/macorner/BackToTopButton';
import {
  MADE_FOR_DADS_TABS,
  FOR_YOUR_GRAD_TABS,
  AMERICAS_250TH_TABS,
  SHOP_BY_RECIPIENT,
  SHOP_BY_PRODUCT,
} from '~/lib/content';
import { CATEGORY_ICONS_QUERY } from '~/lib/graphql/categoryIcons';
import { HERO_BANNER_QUERY } from '~/lib/graphql/heroBanner';
import { COLLECTION_PRODUCTS_BY_KEY_QUERY } from '~/lib/graphql/collection';
import { COLLECTION_KEYS } from '~/lib/constants';

export async function loader({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const [{ collections }, { metaobjects }, { collection: bestSellingCollection }] = await Promise.all([
    storefront.query(CATEGORY_ICONS_QUERY, { cache: storefront.CacheLong() }),
    storefront.query(HERO_BANNER_QUERY, { cache: storefront.CacheLong() }),
    storefront.query(COLLECTION_PRODUCTS_BY_KEY_QUERY, {
      variables: { handle: COLLECTION_KEYS.BEST_SELLING, first: 8 },
      cache: storefront.CacheLong(),
    }),
  ]);

  const categoryIcons = collections.nodes.filter(
    (col: { isMainCollection?: { value: string } | null }) =>
      col.isMainCollection?.value === 'true'
  );

  const heroFields: Record<string, string> = {};
  let heroImage: { url: string; altText: string | null } | null = null;

  console.log('Loader Data:', {
    data: JSON.stringify(bestSellingCollection, null, 2),
  });

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
    (p: {
      id: string;
      title: string;
      handle: string;
      featuredImage: { url: string; altText: string | null } | null;
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    }) => ({
      title: p.title,
      href: `/products/${p.handle}`,
      imageSrc: p.featuredImage?.url ?? '',
      alt: p.featuredImage?.altText ?? p.title,
      price: `$${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)} ${p.priceRange.minVariantPrice.currencyCode}`,
    })
  );

  return { categoryIcons, heroBanner, trendingProducts };
}

export default function Homepage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CategoryIconRow collections={loaderData.categoryIcons} />
      <HeroBanner data={loaderData.heroBanner} />
      <TrendingNow products={loaderData.trendingProducts} />

      <CollectionTabsSection
        bannerTitle="Made For Dads"
        bannerSubtitle="Gifts that fit his style and routine"
        bannerImageSrc="/images/Father_s_Day_homepage_banner_2000x.webp"
        bannerImageAlt="Made For Dads — Father's Day collection"
        bannerImageSide="right"
        tabs={MADE_FOR_DADS_TABS}
      />

      <CollectionTabsSection
        bannerTitle="For Your Grad"
        bannerSubtitle="Turn pride into a keepsake."
        bannerImageSrc="/images/Graduation_Homepage_Banner_1_2000x.webp"
        bannerImageAlt="For Your Grad — Graduation collection"
        bannerImageSide="left"
        tabs={FOR_YOUR_GRAD_TABS}
      />

      <CollectionTabsSection
        bannerTitle="America's 250th"
        bannerSubtitle="Gifts that carry history forward."
        bannerImageSrc="/images/Banner_4th_of_July_30cebbd1-f91e-4c39-9883-310480047909_2000x.webp"
        bannerImageAlt="America's 250th Anniversary collection"
        bannerImageSide="right"
        tabs={AMERICAS_250TH_TABS}
      />

      <PhotoCategoryGrid title="Shop By Recipient" items={SHOP_BY_RECIPIENT} />
      <PhotoCategoryGrid title="Shop By Product" items={SHOP_BY_PRODUCT} />

      <HappyCustomers />
      <PromoBar />
      <BackToTopButton />
    </div>
  );
}
