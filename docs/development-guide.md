# Development Guide — macorner-clone

**Date:** 2026-06-03

---

## Prerequisites

| Requirement | Version | Notes |
|------------|---------|-------|
| Node.js | ≥ 18 | Required by Hydrogen |
| npm | ≥ 9 | Bundled with Node 18 |
| Shopify CLI | 3.93.2 (pinned in devDeps) | Used for `hydrogen dev/build/deploy` |
| Shopify Store | — | With Storefront API enabled |
| Cloudflare Workers account | — | For production deploy (via Shopify Oxygen) |

---

## Initial Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd macorner-clone

# 2. Install dependencies (all work happens inside hydrogen-storefront/)
cd hydrogen-storefront
npm install

# 3. Set up environment variables
# Create a .env file with your Shopify credentials:
cat > .env << 'EOF'
SESSION_SECRET=<random-secret-string>
PUBLIC_STORE_DOMAIN=<your-store>.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=<your-public-storefront-token>
PUBLIC_STOREFRONT_ID=<your-storefront-id>
PUBLIC_CHECKOUT_DOMAIN=<your-store>.myshopify.com
EOF

# 4. Start development server
npm run dev
```

The dev server runs at `http://localhost:3000` via `@shopify/mini-oxygen`.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `SESSION_SECRET` | ✓ | Cookie session signing — any random string in dev |
| `PUBLIC_STORE_DOMAIN` | ✓ | Shopify store domain (`.myshopify.com`) |
| `PUBLIC_STOREFRONT_API_TOKEN` | ✓ | Public Storefront API access token |
| `PUBLIC_STOREFRONT_ID` | ✓ | Storefront ID for Analytics |
| `PUBLIC_CHECKOUT_DOMAIN` | ✓ | Checkout domain for consent banner |

Get `PUBLIC_STOREFRONT_API_TOKEN` and `PUBLIC_STOREFRONT_ID` from Shopify Admin → Apps → Headless → Storefront API.

---

## Development Commands

```bash
# Start dev server with MiniOxygen + auto codegen watch
npm run dev

# Type-check (React Router typegen + tsc --noEmit)
npm run typecheck

# Lint
npm run lint

# Regenerate Storefront API types + React Router route types
npm run codegen

# Production build + codegen
npm run build

# Preview production build locally
npm run preview
```

---

## Codegen

The project uses `@shopify/hydrogen-codegen` to generate TypeScript types from GraphQL queries. Run automatically during `dev` and `build`. Manually trigger with:

```bash
npm run codegen
```

Output files (committed to repo):
- `storefrontapi.generated.d.ts` — Typed Storefront API query results
- `customer-accountapi.generated.d.ts` — Customer Account API types
- `.react-router/types/**` — React Router typed route params

**Important**: After adding a new GraphQL query or modifying an existing one, run `npm run codegen` so the types update.

---

## Adding a New Page / Route

1. Create a file in `hydrogen-storefront/app/routes/` following React Router file naming conventions (e.g., `about.tsx` → `/about`, `blog.$handle.tsx` → `/blog/:handle`)
2. Export a `loader` function for server-side data fetching
3. Export a default React component
4. Add a `meta` export for SEO if needed
5. Run `npm run codegen` to generate route types

**Loader pattern:**
```typescript
import type { Route } from './+types/your-route';

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { storefront } = context;
  const data = await storefront.query(YOUR_QUERY, {
    variables: { ... },
    cache: storefront.CacheShort(), // or CacheLong / CacheNone
  });
  return { data };
}

export default function YourPage({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.data}</div>;
}
```

---

## Adding a New GraphQL Query

1. Create or update a file in `hydrogen-storefront/app/lib/graphql/`
2. Export the query as a tagged template literal with `as const`:
   ```typescript
   export const MY_QUERY = `#graphql
     query MyQuery($handle: String!) {
       ...
     }
   ` as const;
   ```
3. Import in the route loader and call `storefront.query(MY_QUERY, { variables: {...} })`
4. Run `npm run codegen` to generate types

---

## Adding a New Component

1. Create the component in `hydrogen-storefront/app/components/macorner/`
2. Use Tailwind classes + CSS variables from `app/styles/app.css`
3. Use the `min-[990px]:` breakpoint for desktop layout (not `lg:`)
4. No tests required

---

## Shopify Admin Setup

For this clone to work, your Shopify store needs:

| Setup | Details |
|-------|---------|
| Storefront API | Enable public access |
| `main-menu` Shopify menu | Used for header navigation |
| `footer` Shopify menu | Used for footer navigation |
| `hero_banner` metaobject type | Fields: `title`, `description`, `action_link`, `image` (MediaImage) |
| `home_content` metaobject type | Fields: `title`, `description`, `actionLink`, `image`, `collections` (list of collection references) |
| `isMainCollection` metafield | Boolean on Collection — set to `"true"` on main categories |
| `best-selling` collection | Handle must match `COLLECTION_KEYS.BEST_SELLING` |
| `custom.personalization` metafield | Type: `json`, namespace: `custom`, key: `personalization`, on Product — see schema below |

### `custom.personalization` Metafield Schema

Create this metafield definition in Shopify Admin → Settings → Custom data → Products → Add definition.

- **Namespace:** `custom`
- **Key:** `personalization`
- **Type:** JSON

The value must be a JSON array of field descriptor objects. Example:

```json
[
  {
    "key": "name",
    "label": "Name",
    "type": "text",
    "required": true,
    "maxLength": 30,
    "placeholder": "Enter recipient name"
  },
  {
    "key": "style",
    "label": "Style",
    "type": "select",
    "required": false,
    "options": ["Classic", "Modern", "Script"]
  },
  {
    "key": "photo",
    "label": "Photo",
    "type": "image",
    "required": false
  }
]
```

Supported `type` values: `"text"`, `"textarea"`, `"select"`, `"image"`.

If the metafield is absent or null on a product, `Personalizer` renders nothing (graceful fallback — no fields shown).

> **Known limitation:** Shopify line-item attributes are truncated at ~5 KB. Image uploads stored as data-URLs (base64) will be truncated for large files. A production-grade solution would upload the image to a CDN and store the URL instead.

---

## Code Style

- **TypeScript**: Strict mode, no `any` except where Storefront API sort keys require it
- **Styling**: Tailwind classes only — no inline `style` objects except for dynamic values. Inline `<style>` blocks permitted for page-scoped overrides
- **Comments**: None unless WHY is non-obvious
- **No tests**: Frontend testing is intentionally excluded

---

## Known Constraints

- `CacheNone()` on product pages: product variant data is URL-param-specific, so caching would serve wrong variants
- `shouldRevalidate` in `root.tsx` defaults to `false` for all GET navigations to avoid re-fetching header/footer on every page transition — mutations still revalidate
- The dev server disables caching entirely (per `import.meta.env.DEV` check in `context.ts`)

---

_Generated using BMAD Method `document-project` workflow — 2026-06-03_
