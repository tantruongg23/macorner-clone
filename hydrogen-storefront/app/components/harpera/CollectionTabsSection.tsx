import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ProductCard } from './ProductCard';
import type { TabSection, ProductCard as ProductCardType } from '~/lib/content';

function ActionLink({href, className, children}: {href: string; className?: string; children: ReactNode}) {
  const isInternal = href.startsWith('/');
  if (isInternal) return <Link to={href} className={className}>{children}</Link>;
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

  const activeProducts = tabs[activeTab]?.products ?? [];

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
            {/* list-menu list-menu--inline submenu */}
            <nav aria-label="Product categories" className="mb-8 md:mb-10">
              <ul className="list-menu list-menu--inline" role="tablist">
                {tabs.map((tab, index) => (
                  <li
                    key={index}
                    className={`list-menu__item${activeTab === index ? ' list-menu__item--active' : ''}`}
                    role="presentation"
                  >
                    <button
                      role="tab"
                      aria-selected={activeTab === index}
                      aria-controls={`tab-panel-${index}`}
                      id={`tab-${index}`}
                      onClick={() => setActiveTab(index)}
                      className="list-menu__link"
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
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
          </div>
        )}
      </div>
    </section>
  );
}
