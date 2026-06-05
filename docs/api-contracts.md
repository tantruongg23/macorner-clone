# API Contracts — Storefront API Queries

**Date:** 2026-06-03
**Data source:** Shopify Storefront GraphQL API
**Location:** `hydrogen-storefront/app/lib/graphql/`

All data fetching goes through `context.storefront.query()` — a typed, cache-aware Shopify Hydrogen wrapper. There is no custom REST API or separate backend.

---

## Query Index

| Query | File | Route(s) | Cache |
|-------|------|---------|-------|
| `HEADER_QUERY` | `menu.ts` | All pages (root) | `CacheLong()` |
| `FOOTER_QUERY` | `menu.ts` | All pages (root, deferred) | `CacheLong()` |
| `CATEGORY_ICONS_QUERY` | `categoryIcons.ts` | `/` | `CacheLong()` |
| `HERO_BANNER_QUERY` | `heroBanner.ts` | `/` | `CacheLong()` |
| `COLLECTION_PRODUCTS_BY_KEY_QUERY` | `collection.ts` | `/` | `CacheLong()` |
| `HOME_CONTENT_QUERY` | `homeContent.ts` | `/` | `CacheShort()` |
| `COLLECTION_QUERY` (inline) | `routes/collections.$handle.tsx` | `/collections/:handle` | `CacheShort()` |
| `PRODUCT_QUERY` | `product.ts` | `/products/:handle` | `CacheNone()` |
| `RELATED_PRODUCTS_QUERY` | `product.ts` | `/products/:handle` | `CacheShort()` |
| `CART_QUERY_FRAGMENT` | `cart.ts` | All pages (root) | `CacheLong()` |
| Navigation queries | `navigation.ts` | All pages (root) | `CacheLong()` |

---

## Root / Global Queries

### `HEADER_QUERY` — `menu.ts`

Fetches the main-menu Shopify navigation for the header.

```graphql
query Header($headerMenuHandle: String!) {
  menu(handle: $headerMenuHandle) {
    id
    items { ... }
  }
}
```

**Variables:** `{ headerMenuHandle: 'main-menu' }`
**Returns:** Menu items for header navigation

---

### `FOOTER_QUERY` — `menu.ts`

Fetches the footer Shopify navigation (deferred — non-blocking).

**Variables:** `{ footerMenuHandle: 'footer' }`
**Returns:** Menu items for footer columns

---

## Home Page Queries (`routes/_index.tsx`)

### `CATEGORY_ICONS_QUERY` — `categoryIcons.ts`

Fetches collections with `isMainCollection` metafield to populate `CategoryIconRow`.

```graphql
# Returns: collection nodes with title, handle, image, isMainCollection metafield
# Filter applied in loader: isMainCollection?.value === 'true'
```

---

### `HERO_BANNER_QUERY` — `heroBanner.ts`

Fetches the `hero_banner` metaobject.

```graphql
# Returns: metaobjects.nodes[0].fields
# Fields: title (String), description (String), action_link (String), image (MediaImage ref)
```

**Loader transformation:**
```typescript
heroFields[field.key] = field.value;       // title, description, action_link
heroImage = field.reference.image;          // image
```

---

### `COLLECTION_PRODUCTS_BY_KEY_QUERY` — `collection.ts`

Fetches products from a collection by handle (used for "Trending Now" / best-selling).

```graphql
query GetCollectionProductsByKey($handle: String!, $first: Int) {
  collection(handle: $handle) {
    products(first: $first) {
      nodes {
        id title handle featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  }
}
```

**Variables:** `{ handle: 'best-selling', first: 8 }`

---

### `HOME_CONTENT_QUERY` — `homeContent.ts`

Fetches `home_content` metaobjects that drive `CollectionTabsSection` components.

```graphql
# Returns: metaobjects.nodes[]
# Each node fields:
#   title (String), description (String), actionLink (String)
#   image (MediaImage ref)
#   collections (list of collection references, each with products.nodes)
```

**Loader transformation:** Each node → `CollectionTabsSectionProps` with `tabs[]` (one per collection reference).

---

## Collection Page Query

### `COLLECTION_QUERY` (inline in `routes/collections.$handle.tsx`)

Paginated product listing for a collection.

```graphql
query CollectionPage(
  $handle: String!
  $first: Int
  $last: Int
  $startCursor: String
  $endCursor: String
  $sortKey: ProductCollectionSortKeys
  $reverse: Boolean
) {
  collection(handle: $handle) {
    id title description
    products(
      first: $first, last: $last
      before: $startCursor, after: $endCursor
      sortKey: $sortKey, reverse: $reverse
    ) {
      nodes {
        id title handle availableForSale
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url altText width height }
        variants(first: 1) { nodes { id availableForSale } }
        tags
      }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
  }
}
```

**Variables from URL params:**
| URL param | GraphQL variable | Default |
|-----------|----------------|---------|
| `?sort_by=manual` | `sortKey: MANUAL` | `MANUAL` |
| `?sort_by=price-asc` | `sortKey: PRICE, reverse: false` | — |
| `?sort_by=price-desc` | `sortKey: PRICE, reverse: true` | — |
| `?sort_by=title-asc` | `sortKey: TITLE, reverse: false` | — |
| `?sort_by=best-selling` | `sortKey: BEST_SELLING` | — |
| `?cursor=<endCursor>` | `first: 16, endCursor: cursor` | Forward page |
| `?prev=<startCursor>` | `last: 16, startCursor: prev` | Backward page |

---

## Product Page Queries

### `PRODUCT_QUERY` — `product.ts`

Full product detail with variant selection.

```graphql
query GetProduct(
  $handle: String!
  $selectedOptions: [SelectedOptionInput!]!
  $country: CountryCode
  $language: LanguageCode
) @inContext(country: $country, language: $language) {
  product(handle: $handle) {
    id title handle description descriptionHtml vendor productType tags
    images(first: 20) { nodes { id url altText width height } }
    options { id name optionValues { name } }
    selectedVariant: variantBySelectedOptions(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) { ...ProductVariantFields }
    variants(first: 250) { nodes { ...ProductVariantFields } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
  }
}

fragment ProductVariantFields on ProductVariant {
  id availableForSale quantityAvailable
  price { amount currencyCode }
  compareAtPrice { amount currencyCode }
  selectedOptions { name value }
  image { id url altText width height }
}
```

**Variables:** `selectedOptions` built from `URL.searchParams` entries.

**Variant redirect:** If `selectedVariant` is null and variants exist, loader throws a redirect to the URL with the first available variant's `selectedOptions` as search params.

---

### `RELATED_PRODUCTS_QUERY` — `product.ts`

Fetches products from a collection for "More Items to Consider" section.

```graphql
query GetRelatedProducts($handle: String!, $country: CountryCode, $language: LanguageCode)
@inContext(country: $country, language: $language) {
  collection(handle: $handle) {
    products(first: 5) {
      nodes { id title handle featuredImage { url altText }
              priceRange { minVariantPrice { amount currencyCode } } }
    }
  }
}
```

**Variables:** `{ handle: 'best-selling' }` — filtered in loader to exclude current product, sliced to 4.

---

## Cart Fragment

### `CART_QUERY_FRAGMENT` — `cart.ts`

Defines the cart shape for Hydrogen's built-in cart management. Used to initialize the Hydrogen context cart.

---

## Authentication

No customer authentication is implemented. The Storefront API uses a **public access token** (`PUBLIC_STOREFRONT_API_TOKEN`) — safe to expose to the browser.

`customerAccount` context is available (from Hydrogen) but no customer-specific routes are implemented.

---

_Generated using BMAD Method `document-project` workflow — 2026-06-03_
