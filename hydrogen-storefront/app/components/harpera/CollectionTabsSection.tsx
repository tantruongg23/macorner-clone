import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ProductCard } from './ProductCard';
import type { TabSection, ProductCard as ProductCardType } from '~/lib/content';

function ActionLink({href, className, children}: {href: string; className?: string; children: ReactNode}) {
  const isInternal = href.startsWith('/');
  if (isInternal) return <Link to={href} prefetch="intent" className={className}>{children}</Link>;
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export interface CollectionTabsSectionProps {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImageSrc: string;
  bannerImageAlt: string;
  bannerImageSide: 'left' | 'right';
  actionLink?: string;
  actionLabel?: string;
  tabs: TabSection[];
}

export function CollectionTabsSection({
  bannerTitle,
  bannerSubtitle,
  bannerImageSrc,
  bannerImageAlt,
  bannerImageSide,
  actionLink = '#',
  actionLabel,
  tabs,
}: CollectionTabsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (activeTab >= tabs.length) setActiveTab(0);
  }, [tabs.length, activeTab]);

  const active = tabs[activeTab];
  const activeProducts = active?.products ?? [];
  const activeHref = active?.href;

  return (
    <section className="py-12 md:py-16 bg-[#f4f8fc]">
      <div className="container-harpera">
        {/* Banner */}
        <div className="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className={`relative min-h-[250px] md:min-h-[350px] ${bannerImageSide === 'right' ? 'md:order-2' : 'md:order-1'}`}>
            <img
              src={bannerImageSrc}
              alt={bannerImageAlt}
              className="h-full w-full object-cover rounded-[20px]"
            />
          </div>
          <div className={`flex flex-col gap-3 md:gap-4 ${bannerImageSide === 'right' ? 'md:order-1' : 'md:order-2'}`}>
            <h2 className="heading-script italic text-[32px] md:text-[48px] leading-[1.2]">
              {bannerTitle}
            </h2>
            <p className="text-[15px] md:text-base text-[rgba(18,18,18,0.7)]">
              {bannerSubtitle}
            </p>
            <ActionLink href={actionLink} className="btn-pill-orange w-fit">
              {actionLabel ?? 'EXPLORE'}
            </ActionLink>
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div>
            {/* Collection pills — horizontally scrollable on small screens */}
            <nav aria-label="Product categories" className="mb-8 md:mb-10">
              <ul
                className="flex flex-nowrap items-center gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center"
                role="tablist"
              >
                {tabs.map((tab, index) => {
                  const isActive = activeTab === index;
                  return (
                    <li key={index} className="flex-shrink-0" role="presentation">
                      <button
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tab-panel-${index}`}
                        id={`tab-${index}`}
                        onClick={() => setActiveTab(index)}
                        className={`whitespace-nowrap rounded-full border-[0.8px] px-[15px] py-2.5 text-[15px] md:text-base leading-none transition-colors ${
                          isActive
                            ? 'border-[var(--color-accent)] bg-white text-[var(--color-accent)]'
                            : 'border-transparent bg-[rgba(115,115,115,0.1)] text-[var(--color-brand-navy)] hover:bg-[rgba(115,115,115,0.18)]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Tab panel */}
            <div
              role="tabpanel"
              id={`tab-panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7"
            >
              {activeProducts.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </div>

            {/* Show More — links to the active collection's page */}
            {activeHref && (
              <div className="mt-8 md:mt-10 text-center">
                <ActionLink
                  href={activeHref}
                  className="inline-flex h-[47px] items-center justify-center rounded-full bg-[rgba(115,115,115,0.1)] px-[30px] text-base text-[var(--color-brand-navy)] transition-colors hover:bg-[rgba(115,115,115,0.18)]"
                >
                  Show More
                </ActionLink>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
