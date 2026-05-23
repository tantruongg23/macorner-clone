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

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CategoryIconRow />
      <HeroBanner />
      <TrendingNow />

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
