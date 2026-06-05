# Architecture — macorner-clone (Hydrogen Storefront)

**Date:** 2026-06-03
**Part:** `hydrogen-storefront`
**Project Type:** Web — Shopify Hydrogen
**Architecture Pattern:** Component-based SSR/Hybrid

---

## Executive Summary

The storefront is a Shopify Hydrogen application running on Cloudflare Workers. It uses React Router 7 for SSR routing, with all data fetched from the Shopify Storefront GraphQL API in route loaders. There is no client-side data fetching for page content and no custom backend. The design system is Tailwind CSS v4 with brand tokens declared inline.

---

## Technology Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Runtime | Cloudflare Workers | `@shopify/mini-oxygen` for dev, Oxygen for prod |
| Framework | Shopify Hydrogen 2026.4.2 | Wraps React Router with Shopify context |
| Routing | React Router 7.14.0 | File-based routes, SSR loaders |
| UI | React 18.3.1 + TypeScript 5.9.2 | Strict typing, no test files |
| Styling | Tailwind CSS v4 | `@import "tailwindcss"` + `@theme inline` |
| Bundler | Vite 8.x | `@tailwindcss/vite` plugin |
| Data | Shopify Storefront API (GraphQL) | No other data sources |
| Types | `@shopify/hydrogen-codegen` | Auto-generates typed query results |
| UI Primitives | Radix UI | Dialog, DropdownMenu, Slot, Tooltip |

---

## Architecture Pattern

**SSR Loader + Client Hydration**

```
Browser Request
      │
      ▼
Cloudflare Worker (server.ts)
      │  createHydrogenRouterContext()
      │  ├─ Opens cache: caches.open('hydrogen')
      │  ├─ Creates session: AppSession.init()
      │  └─ createHydrogenContext() → { storefront, cart, customerAccount, session }
      │
      ▼
React Router Request Handler
      │  Matches route → calls loader()
      │
      ▼
Route Loader (server-side)
      │  context.storefront.query(GRAPHQL_QUERY, { cache: storefront.CacheXxx() })
      │  Returns serializable data
      │
      ▼
React Component (renders on server, hydrates on client)
      │  loaderData → props
      │  Client interactions: cart mutations via useFetcher
      │
      ▼
Response to Browser (streamed HTML + JS bundle)
```

---

## Data Architecture

### Data Source

**Single source of truth: Shopify Storefront GraphQL API**

All queries go through `context.storefront.query()` — a typed, cache-aware wrapper provided by Hydrogen.

### Cache Strategy

| Data | Cache | Reason |
|------|-------|--------|
| Header nav, footer nav | `CacheLong()` | Rarely changes |
| Category icon collections | `CacheLong()` | Rarely changes |
| Hero banner (metaobject) | `CacheLong()` | Rarely changes |
| Home content sections (metaobjects) | `CacheShort()` | Editor-updated content |
| Collection product lists | `CacheShort()` | Price/inventory changes |
| Product detail page | `CacheNone()` | Variant is URL-param-specific |

### Content Management via Metaobjects

Two types of Shopify metaobjects drive dynamic content:

**`hero_banner` metaobject**
- Fields: `title`, `description`, `action_link`, `image` (MediaImage reference)
- Queried via `HERO_BANNER_QUERY` → drives `HeroBanner` component

**`home_content` metaobject** (list)
- Fields: `title`, `description`, `actionLink`, `image`, `collections` (list of collection references)
- Each node becomes a `CollectionTabsSection` on the home page
- Layout alternates banner side (left/right) by index

### Collection Metafield for Category Icons

Collections with `isMainCollection` metafield value `"true"` are surfaced as category icons in the `CategoryIconRow` component.

---

## Route Architecture

| Route | File | Loader | Key Queries |
|-------|------|--------|-------------|
| `/` | `routes/_index.tsx` | `loader()` | CATEGORY_ICONS_QUERY, HERO_BANNER_QUERY, COLLECTION_PRODUCTS_BY_KEY_QUERY, HOME_CONTENT_QUERY |
| `/collections/:handle` | `routes/collections.$handle.tsx` | `loader()` | COLLECTION_QUERY (inline) |
| `/products/:handle` | `routes/products.$handle.tsx` | `loader()` | PRODUCT_QUERY, RELATED_PRODUCTS_QUERY |
| `/cart` | `routes/cart.tsx` | `loader()` | Cart fragment |
| `root.tsx` | `root.tsx` | `loader()` | HEADER_QUERY, FOOTER_QUERY, NavigationService |

### Root Loader Strategy

The root loader splits data into **critical** (blocking) and **deferred** (non-blocking):

```typescript
// Critical — blocks render
const [header, navigationTree] = await Promise.all([
  storefront.query(HEADER_QUERY, { cache: storefront.CacheLong() }),
  navigationService.getNavigationTree(),
]);

// Deferred — non-blocking, can fail gracefully
const footer = storefront.query(FOOTER_QUERY, ...).catch(() => null);
const cart = cart.get();
const isLoggedIn = customerAccount.isLoggedIn();
```

### Collection Pagination

URL params drive cursor-based pagination:
- **Forward**: `?cursor=<endCursor>` → `first: 16, endCursor: cursor`
- **Backward**: `?prev=<startCursor>` → `last: 16, startCursor: prev`
- **Sorting**: `?sort_by=manual|price-asc|price-desc|title-asc|title-desc|date|best-selling`

### Product Variant Selection

```
GET /products/:handle
  → Read selectedOptions from URL search params
  → variantBySelectedOptions(selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true)
  → If no variant selected: redirect to first available variant URL
```

---

## Component Architecture

### Component Hierarchy

```
root.tsx (Analytics.Provider)
└── PageLayout
    ├── MacornerHeader (sticky, z-50)
    │   ├── Logo + search bar
    │   ├── Navigation mega-menu (NavigationTree from Storefront menus)
    │   └── Cart icon + count bubble
    ├── <Outlet> (page content)
    │   ├── Homepage
    │   │   ├── CategoryIconRow
    │   │   ├── HeroBanner
    │   │   ├── TrendingNow
    │   │   ├── CollectionTabsSection[]
    │   │   ├── PhotoCategoryGrid (Shop By Recipient)
    │   │   ├── PhotoCategoryGrid (Shop By Product)
    │   │   ├── HappyCustomers
    │   │   └── PromoBar
    │   ├── CollectionPage
    │   │   ├── CollectionToolbar (sort + title)
    │   │   ├── CollectionProductCard[] (grid)
    │   │   └── CollectionPagination
    │   └── ProductPage
    │       ├── ProductGallery
    │       ├── ProductForm (variant selector + add to cart)
    │       ├── CustomerReviews (mock data + write form)
    │       └── MoreItems (related products)
    └── MacornerFooter
        ├── Newsletter section
        ├── Link columns (Shop, Macorner, Help)
        └── Social links
```

### State Management

| State | Mechanism |
|-------|----------|
| Cart | Hydrogen `cart` context, managed via `CartMain` + `useFetcher` mutations |
| Navigation data | React Router root loader (`useRouteLoaderData`) |
| Product variant | URL search params (source of truth), no client state |
| Cart drawer | `Aside` component with `open/close` via URL hash or state |

---

## API Design (Storefront API)

All queries are in `app/lib/graphql/`. See [api-contracts.md](./api-contracts.md) for full reference.

### Authentication

No customer authentication implemented in this clone. The Storefront API token is a **public** access token (`PUBLIC_STOREFRONT_API_TOKEN`) loaded from environment variables and injected via `env.d.ts`.

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Cookie session signing (required) |
| `PUBLIC_STORE_DOMAIN` | Shopify store domain |
| `PUBLIC_STOREFRONT_API_TOKEN` | Public Storefront API access token |
| `PUBLIC_STOREFRONT_ID` | For Analytics |
| `PUBLIC_CHECKOUT_DOMAIN` | For checkout consent |

---

## Source Tree

See [source-tree-analysis.md](./source-tree-analysis.md)

---

## Development Workflow

See [development-guide.md](./development-guide.md)

---

## Deployment Architecture

**Target runtime:** Shopify Oxygen (Cloudflare Workers)

**Dev runtime:** `@shopify/mini-oxygen` — a local Cloudflare Workers emulator

```
Build:   shopify hydrogen build --codegen
Deploy:  shopify hydrogen deploy (to Shopify Oxygen)
```

The server entrypoint (`server.ts`) exports a standard `fetch` handler — compatible with the Cloudflare Workers `ExportedHandler` interface.

---

_Generated using BMAD Method `document-project` workflow — 2026-06-03_
