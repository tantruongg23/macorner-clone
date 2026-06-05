# macorner-clone - Project Overview

**Date:** 2026-06-03
**Type:** Web — Shopify Hydrogen Storefront
**Architecture:** Component-based SSR/Hybrid (Cloudflare Workers)

## Executive Summary

Pixel-perfect clone of [macorner.co](https://macorner.co) built as a Shopify Hydrogen storefront. The project reverse-engineers the live store's design, content structure, and shopping flows into a production-grade Hydrogen/React Router 7 application. All product data, collections, and content are sourced exclusively from the Shopify Storefront API — there is no separate backend, database, or CMS.

## Project Classification

- **Repository Type:** Monolith (single part)
- **Project Type:** Web (Shopify Hydrogen)
- **Primary Language:** TypeScript
- **Architecture Pattern:** Component-based SSR/Hybrid with Cloudflare Workers runtime
- **Data Layer:** Shopify Storefront GraphQL API only

## Technology Stack Summary

| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| Framework | Shopify Hydrogen | 2026.4.2 | Opinionated Shopify storefront layer |
| Router | React Router | 7.14.0 | SSR + client-side routing |
| UI Library | React | 18.3.1 | |
| Language | TypeScript | 5.9.2 | Strict mode |
| Styling | Tailwind CSS | v4 (^4.3.0) | `@theme inline` tokens, no config file |
| Bundler | Vite | ^8.0.1 | |
| Runtime | Cloudflare Workers | via `@shopify/mini-oxygen` | Dev: MiniOxygen |
| UI Primitives | Radix UI | various | Dialog, DropdownMenu, Slot, Tooltip |
| GraphQL Codegen | `@shopify/hydrogen-codegen` | 0.3.3 | Generates Storefront API types |
| Fonts | Poppins | Google Fonts | All weights, sans-serif |

## Key Features

- **Home page** — Hero banner, category icon row, trending products, collection tab sections, photo category grids, happy customers, promo bar — all driven by Shopify metaobjects and collections
- **Collection listing** — Paginated (16/page), sortable (manual, price asc/desc, title, date, best-selling), cursor-based navigation
- **Product detail** — Variant selection via URL params with auto-redirect, image gallery, add to cart, related products, mock review section with write-a-review form
- **Cart** — Hydrogen-managed cart with line item editing, quantity controls, subtotal, checkout
- **Navigation** — Sticky header with mega-menu navigation tree built from Shopify menus
- **Footer** — Newsletter signup, social links, multi-column link groups — all pixel-matched to macorner.co

## Architecture Highlights

- **Loader pattern**: Every page uses React Router `loader` for server-side data fetching via `context.storefront.query()`. No client-side data fetching for initial page loads.
- **Cache strategy**: `CacheLong()` for nav/hero/icons, `CacheShort()` for collections, `CacheNone()` for product pages (variant-specific)
- **Metaobject-driven content**: Home page hero and content sections are configured via Shopify Admin metaobjects (`hero_banner` type, `home_content` type), not hardcoded
- **No tests**: Frontend tests are intentionally excluded from this project
- **No separate backend**: All data flows exclusively through `context.storefront` (Shopify Storefront API)

## Development Overview

### Prerequisites

- Node.js ≥ 18
- Shopify CLI (`@shopify/cli` 3.93.2)
- A Shopify store with Storefront API access
- Environment variables: `SESSION_SECRET`, `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STOREFRONT_ID`, `PUBLIC_CHECKOUT_DOMAIN`

### Getting Started

```bash
cd hydrogen-storefront
npm install
# Copy .env.example to .env and fill in Shopify credentials
npm run dev
```

### Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with MiniOxygen + codegen watch |
| `npm run build` | Production build + codegen |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | React Router typegen + `tsc --noEmit` |
| `npm run codegen` | Regenerate Storefront API + React Router types |
| `npm run lint` | ESLint |

## Repository Structure

```
macorner-clone/
├── hydrogen-storefront/    # Main application (monolith)
│   ├── app/                # React Router app
│   │   ├── routes/         # Page routes
│   │   ├── components/     # UI components
│   │   │   └── macorner/   # All clone-specific components
│   │   ├── lib/            # Utilities, GraphQL queries, context
│   │   └── styles/         # Global CSS + Tailwind tokens
│   └── server.ts           # Cloudflare Worker entry
└── docs/                   # Project documentation (this folder)
    ├── design-references/  # Screenshots for pixel-matching
    └── research/           # Component specifications
```

## Documentation Map

- [index.md](./index.md) — Master documentation index
- [architecture.md](./architecture.md) — Detailed architecture documentation
- [source-tree-analysis.md](./source-tree-analysis.md) — Annotated directory structure
- [component-inventory.md](./component-inventory.md) — All UI components catalogued
- [development-guide.md](./development-guide.md) — Dev setup and workflow
- [api-contracts.md](./api-contracts.md) — Storefront API queries reference

---

_Generated using BMAD Method `document-project` workflow — 2026-06-03_
