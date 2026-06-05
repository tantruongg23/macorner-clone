# Source Tree Analysis — macorner-clone

**Date:** 2026-06-03
**Part:** `hydrogen-storefront/`

---

## Annotated Directory Tree

```
macorner-clone/
├── hydrogen-storefront/          # ← Main application root
│   ├── app/                      # React Router application
│   │   │
│   │   ├── routes/               # ★ ENTRY POINTS — File-based routing
│   │   │   ├── _index.tsx        # / — Home page
│   │   │   ├── collections.$handle.tsx  # /collections/:handle
│   │   │   ├── products.$handle.tsx     # /products/:handle
│   │   │   └── cart.tsx          # /cart
│   │   │
│   │   ├── components/           # UI components
│   │   │   ├── macorner/         # ★ CRITICAL — All clone-specific components
│   │   │   │   ├── Header.tsx           # Sticky header: logo, search, nav, cart
│   │   │   │   ├── Footer.tsx           # Footer: newsletter, links, social
│   │   │   │   ├── HeroBanner.tsx       # Full-width hero (metaobject-driven)
│   │   │   │   ├── CategoryIconRow.tsx  # Scrollable collection icons row
│   │   │   │   ├── TrendingNow.tsx      # Best-selling products horizontal scroll
│   │   │   │   ├── CollectionTabsSection.tsx  # Tabbed products + banner
│   │   │   │   ├── PhotoCategoryGrid.tsx      # Photo grid (Shop By X)
│   │   │   │   ├── HappyCustomers.tsx         # Reviews/trust section
│   │   │   │   ├── PromoBar.tsx               # Bottom promo/urgency bar
│   │   │   │   ├── BackToTopButton.tsx        # Floating back-to-top
│   │   │   │   ├── CollectionToolbar.tsx      # Sort + product count
│   │   │   │   ├── CollectionProductCard.tsx  # Product card in grid
│   │   │   │   ├── CollectionPagination.tsx   # Cursor-based prev/next
│   │   │   │   ├── ProductGallery.tsx         # Image gallery with thumbnails
│   │   │   │   ├── ProductForm.tsx            # Variant select + add to cart
│   │   │   │   ├── ProductCard.tsx            # Compact product card (reusable)
│   │   │   │   └── icons.tsx                  # All SVG icon components
│   │   │   │
│   │   │   ├── PageLayout.tsx    # Root layout wrapper
│   │   │   ├── Aside.tsx         # Cart/search slide-in drawer
│   │   │   ├── CartMain.tsx      # Cart drawer content
│   │   │   ├── CartLineItem.tsx  # Single cart line item
│   │   │   ├── CartSummary.tsx   # Cart totals + checkout button
│   │   │   ├── Header.tsx        # Hydrogen default header (unused, kept)
│   │   │   ├── Footer.tsx        # Hydrogen default footer (unused, kept)
│   │   │   ├── ProductPrice.tsx  # Price formatting component
│   │   │   ├── SearchFormPredictive.tsx    # Search UI
│   │   │   └── SearchResultsPredictive.tsx # Search results
│   │   │
│   │   ├── lib/                  # ★ CRITICAL — Core utilities and data layer
│   │   │   ├── graphql/          # All Storefront API GraphQL queries
│   │   │   │   ├── product.ts    # PRODUCT_QUERY, RELATED_PRODUCTS_QUERY
│   │   │   │   ├── collection.ts # COLLECTION_PRODUCTS_BY_KEY_QUERY
│   │   │   │   ├── heroBanner.ts # HERO_BANNER_QUERY
│   │   │   │   ├── homeContent.ts # HOME_CONTENT_QUERY
│   │   │   │   ├── categoryIcons.ts # CATEGORY_ICONS_QUERY
│   │   │   │   ├── menu.ts       # HEADER_QUERY, FOOTER_QUERY
│   │   │   │   ├── navigation.ts # Navigation tree queries
│   │   │   │   └── cart.ts       # CART_QUERY_FRAGMENT
│   │   │   ├── constants.ts      # COLLECTION_KEYS (e.g. 'best-selling')
│   │   │   ├── content.ts        # Static content: SHOP_BY_RECIPIENT, SHOP_BY_PRODUCT
│   │   │   ├── context.ts        # createHydrogenRouterContext()
│   │   │   ├── fragments.ts      # Shared GraphQL fragments
│   │   │   ├── navigation.ts     # NavigationService class
│   │   │   ├── session.ts        # AppSession cookie handler
│   │   │   ├── search.ts         # Search utilities
│   │   │   └── variants.ts       # Variant selection helpers
│   │   │
│   │   ├── styles/               # Global styles
│   │   │   ├── app.css           # ★ Tailwind v4 import + @theme inline design tokens
│   │   │   └── reset.css         # CSS reset
│   │   │
│   │   ├── types/
│   │   │   └── collection.ts     # SortByValue, ProductNode, SORT_OPTIONS types
│   │   │
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   │
│   │   ├── root.tsx              # ★ App shell: Analytics.Provider, PageLayout, ErrorBoundary
│   │   ├── routes.ts             # React Router routes config
│   │   ├── entry.client.tsx      # Client hydration entry
│   │   └── entry.server.tsx      # SSR render entry
│   │
│   ├── server.ts                 # ★ Cloudflare Worker fetch handler (entry point)
│   ├── react-router.config.ts    # React Router config
│   ├── .graphqlrc.ts             # GraphQL codegen config
│   ├── tsconfig.json
│   ├── env.d.ts                  # Env var type declarations
│   ├── storefrontapi.generated.d.ts   # Auto-generated Storefront API types
│   └── customer-accountapi.generated.d.ts
│
├── docs/                         # ★ Project documentation (this folder)
│   ├── index.md                  # Master index (primary AI entry point)
│   ├── project-overview.md
│   ├── architecture.md
│   ├── source-tree-analysis.md
│   ├── component-inventory.md
│   ├── development-guide.md
│   ├── api-contracts.md
│   ├── project-scan-report.json  # Workflow state
│   ├── design-references/        # Screenshots for pixel-matching
│   └── research/
│       └── components/           # Component design specs
│           ├── Header.spec.md
│           └── Footer.spec.md
│
├── _bmad/                        # BMAD workflow scripts and config
└── .claude/                      # Claude Code skills and settings
```

---

## Critical Directories Summary

| Directory | Purpose |
|-----------|---------|
| `hydrogen-storefront/app/routes/` | All page routes — start here for any page feature |
| `hydrogen-storefront/app/components/macorner/` | All clone-specific UI — pixel-matched to macorner.co |
| `hydrogen-storefront/app/lib/graphql/` | Every Storefront API query — grouped by domain |
| `hydrogen-storefront/app/styles/app.css` | Design system tokens — add new brand tokens here |
| `hydrogen-storefront/server.ts` | Cloudflare Worker entry — Hydrogen context initialization |

---

## Entry Points

| Entry Point | Type | Purpose |
|-------------|------|---------|
| `server.ts` | Worker | Cloudflare fetch handler, initializes Hydrogen context |
| `app/entry.server.tsx` | SSR | React Router server-side render |
| `app/entry.client.tsx` | Client | React hydration |
| `app/root.tsx` | App shell | Global providers, root loader, error boundary |
| `app/routes/_index.tsx` | Page | Home page route + loader |

---

_Generated using BMAD Method `document-project` workflow — 2026-06-03_
