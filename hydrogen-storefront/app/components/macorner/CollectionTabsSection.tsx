import { useState } from 'react';
import { ProductCard } from './ProductCard';
import type { TabSection, ProductCard as ProductCardType } from '~/lib/content';

export interface CollectionTabsSectionProps {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImageSrc: string;
  bannerImageAlt: string;
  bannerImageSide: 'left' | 'right';
  tabs: TabSection[];
}

export function CollectionTabsSection({
  bannerTitle,
  bannerSubtitle,
  bannerImageSrc,
  bannerImageAlt,
  bannerImageSide,
  tabs,
}: CollectionTabsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeProducts = tabs[activeTab].products;

  return (
    <section className="py-12 md:py-16 bg-[#fff9f4]">
      <div className="container-macorner">
        {/* Banner */}
        <div className="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {bannerImageSide === 'left' && (
            <div className="relative min-h-[250px] md:min-h-[350px] order-1">
              <img
                src={bannerImageSrc}
                alt={bannerImageAlt}
                className="h-full w-full object-cover rounded-[20px]"
              />
            </div>
          )}
          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="heading-script italic text-[32px] md:text-[48px] leading-[1.2]">
              {bannerTitle}
            </h2>
            <p className="text-[15px] md:text-base text-[rgba(18,18,18,0.7)]">
              {bannerSubtitle}
            </p>
            <a href="#" className="btn-pill-orange w-fit">
              EXPLORE
            </a>
          </div>
          {bannerImageSide === 'right' && (
            <div className="relative min-h-[250px] md:min-h-[350px] order-2">
              <img
                src={bannerImageSrc}
                alt={bannerImageAlt}
                className="h-full w-full object-cover rounded-[20px]"
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div>
          {/* Tab buttons */}
          <div className="mb-8 md:mb-10 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 md:gap-4 border-b border-[rgba(18,18,18,0.1)] min-w-max md:min-w-full">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === index
                      ? 'border-[#F36621] text-[#F36621]'
                      : 'border-transparent text-[rgba(18,18,18,0.55)] hover:text-[rgb(18,18,18)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {activeProducts.map((product) => (
              <ProductCard key={product.title} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
