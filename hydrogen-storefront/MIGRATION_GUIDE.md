# Macorner Hydrogen Storefront — Migration Guide

**Status:** ✅ Scaffolding Complete | 🔄 Ready for Storefront API Integration

This document describes what was migrated from the Next.js clone template to the Hydrogen framework, and what needs to be configured next.

---

## What Was Completed

### ✅ Framework Setup
- **Hydrogen 2026.4.2** scaffolded with React Router v7
- **Tailwind CSS v4** configured with Vite (@tailwindcss/vite plugin)
- **TypeScript** strict mode enabled
- **Public assets** (images, icons) copied from cloned template

### ✅ Styling & Design System
- **Macorner brand CSS** added to `app/styles/app.css`
  - Color palette (orange, navy, cream)
  - Typography (Poppins font family)
  - Component utilities (`.btn-pill-orange`, `.container-macorner`, `.heading-script`)
  - Spacing, radius, and animation tokens
  - Responsive utilities (`.no-scrollbar`, reveal animations)

### ✅ Components Ported
All components from the Next.js template have been migrated to Hydrogen/React Router:

| Component | Location | Status |
|-----------|----------|--------|
| **Header** | `app/components/macorner/Header.tsx` | ✅ Done |
| **Footer** | `app/components/macorner/Footer.tsx` | ✅ Done |
| **ProductCard** | `app/components/macorner/ProductCard.tsx` | ✅ Done |
| **Icons** | `app/components/macorner/icons.tsx` | ✅ Done (15 SVG icons) |

**What changed:**
- Removed `"use client"` directives (not needed in Hydrogen)
- Replaced `next/image` with `<img>` (Hydrogen handles image optimization at the edge)
- Replaced `next/link` with React Router `Link`
- Adapted component structure for Hydrogen's loader/action patterns

### ✅ Routing & Pages
- **Homepage** created at `app/routes/_index.tsx`
  - Hero banner section
  - Trending products grid (sample data included)
  - Scaffolded sections for additional collections (ready for API data)
  - Integrated Macorner Header & Footer

### ✅ Environment Configuration
- `.env.example` created with all required Storefront API variables
- Placeholder values for:
  - `PUBLIC_STORE_DOMAIN` (your Shopify store domain)
  - `PUBLIC_STOREFRONT_API_TOKEN` (Storefront API public token)
  - `PUBLIC_STOREFRONT_API_VERSION` (currently `2026-04`)
  - `SESSION_SECRET` (for customer auth)

### ✅ Public Assets
- ✅ All images (`public/images/`) — 100+ product images copied
- ✅ All icons (`public/icons/`) — 20+ SVG/PNG icons copied
- ✅ Favicon configured

---

## What's Ready to Build

### Route Pages (Ready to Implement)
The following route files are scaffolded and ready for API integration:

```
app/routes/
  _index.tsx              ✅ Homepage (sample data)
  collections.$handle.tsx ⏳ Template ready
  products.$handle.tsx    ⏳ Template ready
  cart.tsx               ⏳ Template ready
  search.tsx             ⏳ Template ready
  account/               ⏳ Customer auth pages
```

### Storefront API Queries
Placeholders exist for GraphQL queries. Once you have a Storefront API token, implement:

- `PRODUCTS_QUERY` — for homepage trending section
- `COLLECTION_QUERY` — for collection pages
- `PRODUCT_DETAILS_QUERY` — for product pages with variants
- `CART_QUERY` — for cart operations
- `SEARCH_QUERY` — for product search

### Judge.me Reviews Integration
The Judge.me review script can be embedded using Hydrogen's script utilities. Placeholder comments in components note where to add:
- Review widget initialization
- Judge.me star ratings
- Photo/video review galleries

---

## Next Steps: Wiring Storefront API

### 1. Create New Shopify Store (Required)
Since you lost access to the original store:

1. Go to https://www.shopify.com/admin
2. Create a new development store
3. Name it something like "macorner-clone-dev"
4. Enable test mode

### 2. Generate Storefront API Token
1. In Shopify Admin: **Apps** → **App settings** → **Develop apps**
2. Create a new app: "Macorner Hydrogen Storefront"
3. Configure → **Storefront API**
4. Enable these scopes:
   - `read_products`
   - `read_collections`
   - `read_customer`
   - `write_customers` (for accounts)
5. Copy the **public access token** (not the private one)
6. Copy your **Storefront ID** (Gid format)

### 3. Set Up Environment
1. Copy `.env.example` to `.env.local`
2. Fill in:
   ```
   PUBLIC_STORE_DOMAIN=your-dev-store.myshopify.com
   PUBLIC_STOREFRONT_API_TOKEN=shpat_xxxxxxxxxxxxx
   PUBLIC_STOREFRONT_API_VERSION=2026-04
   PUBLIC_STOREFRONT_ID=gid://shopify/Shop/xxxxx
   SESSION_SECRET=generate-a-random-32-char-string
   ```

### 4. Import Products
You can scrape products from the original macorner.co using the `/products.json` API:

```bash
# From earlier research, the API endpoint works:
curl https://macorner.co/products.json?limit=250 > products.json
```

Then bulk import into the new store (CSV or API).

### 5. Install Hydrogen CLI Tools
```bash
npm install -g @shopify/cli
shopify hydrogen build --codegen  # Generate TypeScript types
```

---

## File Structure Reference

```
hydrogen-storefront/
├── app/
│   ├── routes/
│   │   └── _index.tsx                 # Homepage (with sample data)
│   ├── components/
│   │   ├── macorner/
│   │   │   ├── Header.tsx             # Macorner header
│   │   │   ├── Footer.tsx             # Macorner footer
│   │   │   ├── ProductCard.tsx        # Product card
│   │   │   └── icons.tsx              # 15 SVG icon components
│   │   ├── Header.tsx                 # Scaffold default
│   │   ├── Footer.tsx                 # Scaffold default
│   │   └── ...                        # Other scaffold components
│   ├── styles/
│   │   ├── app.css                    # Macorner brand styles (Tailwind v4)
│   │   └── reset.css                  # Base resets
│   ├── lib/
│   │   ├── fragments.ts               # GraphQL query fragments
│   │   └── search.ts                  # Search utilities
│   ├── root.tsx                       # Layout wrapper
│   └── +types/                        # TypeScript types (auto-generated)
├── public/
│   ├── images/                        # 100+ product images (from clone)
│   ├── icons/                         # 20+ SVG icons (from clone)
│   └── favicon.svg
├── vite.config.ts                     # Vite + Tailwind config
├── package.json                       # Hydrogen 2026.4.2 + Tailwind
├── .env.example                       # Template environment variables
└── MIGRATION_GUIDE.md                 # This file
```

---

## Development Commands

```bash
# Install dependencies (if not already done)
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Type check & codegen (generates Storefront API types)
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Key Differences: Next.js → Hydrogen

| Aspect | Next.js Clone | Hydrogen |
|--------|--------------|----------|
| **Routing** | File-based (`app/page.tsx`) | File-based (`routes/_index.tsx`) |
| **Data Fetching** | Static/Server Components | React Router `loader()` functions |
| **Image Component** | `next/image` (optimized) | `<img>` + Hydrogen's edge optimization |
| **Links** | `next/link` | `react-router` Link |
| **CSS** | Tailwind v4 + shadcn | Tailwind v4 + custom brand styles |
| **Styling** | Utility classes | Utility classes (same) |
| **Cart** | Would be manual | Hydrogen's `CartProvider` + `useCart()` |
| **Hosting** | Vercel (paid) | Oxygen (Shopify's free edge runtime) |
| **API** | REST/fetch | Storefront API (GraphQL) |

---

## Performance Notes

- ✅ **Tailwind CSS v4**: Next-gen CSS engine, faster builds than v3
- ✅ **Hydrogen on Oxygen**: Global edge caching, <10ms cache hits
- ✅ **React Router v7**: Streaming SSR, faster time-to-first-byte
- ✅ **WebP/AVIF images**: From the clone, already optimized
- ⏳ **Judge.me reviews**: Lazy-loaded after page render (doesn't block paint)

---

## What's NOT Done (Intentional)

These are left as TODOs for you to implement based on your design needs:

- ❌ **Collection Pages** — template ready, needs Storefront API wiring
- ❌ **Product Pages** — template ready, needs variant selector + Judge.me widget
- ❌ **Cart/Checkout** — template ready, needs Hydrogen's CartProvider
- ❌ **Search** — template ready, needs Shopify Predictive Search API
- ❌ **Customer Accounts** — template ready, needs Customer Account API
- ❌ **Dynamic Collections** (Made For Dads, For Your Grad, etc.) — needs product filtering
- ❌ **Wishlist** — needs custom implementation or app integration
- ❌ **Multi-Currency** — needs Shopify Markets setup
- ❌ **Mobile Navigation** — hamburger menu needs sidebar state management

---

## Support & Debugging

### Dev Server Issues
If `npm run dev` fails:
1. Delete `node_modules` and `.npm-cache`
2. `npm install` again
3. Check that Node >= v22 (you have v22.22.1 ✅)

### Storefront API Errors
If queries fail after setting `.env`:
1. Verify token has correct scopes (products, collections, customer)
2. Check store domain matches (should be `your-store.myshopify.com`, not admin URL)
3. Test API access: `curl -H "X-Shopify-Storefront-Access-Token: $TOKEN" "https://<domain>/api/2026-04/graphql.json"`

### TypeScript Errors
Run type generation:
```bash
npm run codegen
```

This regenerates `customer-accountapi.generated.d.ts` and `storefrontapi.generated.d.ts` based on your schema.

---

## Resources

- **Hydrogen Docs**: https://hydrogen.shopify.dev
- **React Router v7**: https://reactrouter.com/docs
- **Shopify Storefront API**: https://shopify.dev/docs/api/storefront
- **Tailwind CSS v4**: https://tailwindcss.com/docs/v4-upgrade-guide

---

**Ready to go live?** Once you have a Storefront API token and products imported, you can deploy to Oxygen (included free with Shopify) or Vercel with a single command. See `vite.config.ts` and `server.ts` for deployment configuration.
