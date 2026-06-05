# Component Inventory — macorner-clone

**Date:** 2026-06-03
**Location:** `hydrogen-storefront/app/components/`

---

## Overview

| Category | Count |
|----------|-------|
| Macorner-specific (clone) components | 17 |
| Shared Hydrogen/layout components | 8 |
| **Total** | **25** |

---

## Macorner Components (`app/components/macorner/`)

These components are pixel-matched to [macorner.co](https://macorner.co). All are presentational/SSR-compatible — no client-side data fetching.

### Layout & Navigation

| Component | File | Purpose |
|-----------|------|---------|
| `MacornerHeader` | `Header.tsx` | Sticky top header — logo, search pill, cart icon with bubble, hamburger (mobile), mega-menu nav (desktop). Props: `navigationTree`. |
| `MacornerFooter` | `Footer.tsx` | Full-width footer — newsletter signup form, 3-column link groups (Shop, Macorner, Help), social icons (Twitter/X, Facebook, Pinterest, Instagram, TikTok). All static links. |
| `BackToTopButton` | `BackToTopButton.tsx` | Fixed floating button — scrolls to top on click. |

### Home Page Sections

| Component | File | Purpose |
|-----------|------|---------|
| `CategoryIconRow` | `CategoryIconRow.tsx` | Horizontally scrollable row of collection icons. Props: `collections[]`. Filters by `isMainCollection` metafield. |
| `HeroBanner` | `HeroBanner.tsx` | Full-width hero — title, description, CTA button, background/side image. Props: `data` (from `HERO_BANNER_QUERY` metaobject). |
| `TrendingNow` | `TrendingNow.tsx` | Horizontal scrollable product cards for best-selling products. Props: `products[]` (`{ title, href, imageSrc, alt, price }`). |
| `CollectionTabsSection` | `CollectionTabsSection.tsx` | Banner (image + text) + tabbed product grid. Tabs switch between collections. Props: `bannerTitle`, `bannerSubtitle`, `bannerImageSrc`, `bannerImageSide` ('left'|'right'), `actionLink`, `tabs[]`. |
| `PhotoCategoryGrid` | `PhotoCategoryGrid.tsx` | Grid of photo+label cards (e.g. "Shop By Recipient", "Shop By Product"). Props: `title`, `items[]`. Items from `SHOP_BY_RECIPIENT`/`SHOP_BY_PRODUCT` in `lib/content.ts`. |
| `HappyCustomers` | `HappyCustomers.tsx` | Social proof section — customer reviews / trust badges. |
| `PromoBar` | `PromoBar.tsx` | Fixed/sticky bottom promo strip — urgency messaging. |

### Collection Page

| Component | File | Purpose |
|-----------|------|---------|
| `CollectionToolbar` | `CollectionToolbar.tsx` | Collection title + product count + sort-by dropdown. Props: `title`, `sortBy`, `totalCount`. Updates `?sort_by` URL param. |
| `CollectionProductCard` | `CollectionProductCard.tsx` | Product card for collection grid — image (aspect-square, rounded), title, price, compare-at price, wishlist icon, availability badge. Props: `product` (ProductNode). |
| `CollectionPagination` | `CollectionPagination.tsx` | Prev/Next page links using cursor-based pagination. Props: `pageInfo`, `sortBy`. |

### Product Page

| Component | File | Purpose |
|-----------|------|---------|
| `ProductGallery` | `ProductGallery.tsx` | Image gallery — main image + thumbnail strip. Switches main image on thumbnail click. Syncs with selected variant image. Props: `images[]`, `selectedVariantImage`. |
| `ProductForm` | `ProductForm.tsx` | Variant selector (option buttons/swatches) + quantity + Add to Cart button. Uses Hydrogen `CartForm` for cart mutations. Props: `product`, `selectedVariant`. |

### Shared / Utility

| Component | File | Purpose |
|-----------|------|---------|
| `ProductCard` | `ProductCard.tsx` | Generic compact product card used across sections. |
| `icons.tsx` | `icons.tsx` | All inline SVG icon components: `CartIcon`, `SearchIcon`, `HeartIcon`, `MenuIcon`, `ChevronDownIcon`, `FacebookIcon`, `InstagramIcon`, `PinterestIcon`, `TiktokIcon`, `TwitterIcon`. |

---

## Shared Hydrogen Components (`app/components/`)

These are Hydrogen scaffold components — some adapted, some kept from the default skeleton.

| Component | File | Purpose |
|-----------|------|---------|
| `PageLayout` | `PageLayout.tsx` | Root layout wrapper — renders `MacornerHeader` + `MacornerFooter` + `Aside` drawers |
| `Aside` | `Aside.tsx` | Slide-in drawer for cart and search |
| `CartMain` | `CartMain.tsx` | Cart drawer body — list of line items + summary |
| `CartLineItem` | `CartLineItem.tsx` | Single cart item — image, title, price, quantity stepper, remove |
| `CartSummary` | `CartSummary.tsx` | Cart subtotal + checkout button |
| `ProductPrice` | `ProductPrice.tsx` | Formats price with currency, handles compare-at price display |
| `SearchFormPredictive` | `SearchFormPredictive.tsx` | Predictive search input |
| `SearchResultsPredictive` | `SearchResultsPredictive.tsx` | Search result dropdown |

---

## Design System

All components use the Tailwind v4 design tokens defined in `app/styles/app.css`:

| Token | Value | Used in |
|-------|-------|---------|
| `--color-brand-orange` | `#f7921f` | CTAs, buttons |
| `--color-brand-orange-deep` | `#f16523` | Hover states, wishlist hover |
| `--color-brand-navy` | `#0b2a4a` | Footer background, submit buttons |
| `--color-brand-cream` | `#fff2e7` | Background highlights |
| `--color-brand-star` | `#f3912e` | Star ratings |
| `--color-header-border` | `#d3d3d3` | Header bottom border |
| `--color-footer-bg` | `rgb(11,42,74)` | Footer |
| `--radius-card` | `20px` | Product images |
| Font | Poppins | All text |
| Desktop breakpoint | `min-[990px]:` | Layout shifts |

---

_Generated using BMAD Method `document-project` workflow — 2026-06-03_
