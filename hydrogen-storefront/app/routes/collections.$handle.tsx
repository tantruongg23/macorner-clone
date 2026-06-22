import {useState} from 'react';
import type {Route} from './+types/collections.$handle';
import {SORT_OPTIONS} from '~/types/collection';
import type {Filter, SortByValue, ProductNode} from '~/types/collection';
import {CollectionFilters} from '~/components/harpera/CollectionFilters';
import {CollectionToolbar} from '~/components/harpera/CollectionToolbar';
import {CollectionProductCard} from '~/components/harpera/CollectionProductCard';
import {CollectionPagination} from '~/components/harpera/CollectionPagination';

const PRODUCTS_PER_PAGE = 16;

const COLLECTION_QUERY = `#graphql
  query CollectionPage(
    $handle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      image {
        url
        altText
      }
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        nodes {
          id
          title
          handle
          availableForSale
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          variants(first: 1) {
            nodes { id availableForSale }
          }
          tags
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
` as const;

export async function loader({params, request, context}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Response('Not Found', {status: 404});

  const url = new URL(request.url);
  const sp = url.searchParams;
  const sortBy = (sp.get('sort_by') ?? 'manual') as SortByValue;
  const cursor = sp.get('cursor') ?? undefined;
  const prev = sp.get('prev') ?? undefined;
  const opt = SORT_OPTIONS[sortBy] ?? SORT_OPTIONS.manual;

  // Parse ?filter.<id>=<jsonInput> URL params into ProductFilter objects
  const activeFilters: unknown[] = [];
  const seenKeys = new Set<string>();
  for (const key of sp.keys()) {
    if (key.startsWith('filter.') && !seenKeys.has(key)) {
      seenKeys.add(key);
      for (const val of sp.getAll(key)) {
        try {
          activeFilters.push(JSON.parse(val) as unknown);
        } catch {
          // skip malformed filter params
        }
      }
    }
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      sortKey: opt.key as any,
      reverse: opt.reverse,
      filters: activeFilters.length > 0 ? (activeFilters as any) : undefined,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      ...(prev
        ? {last: PRODUCTS_PER_PAGE, startCursor: prev}
        : {first: PRODUCTS_PER_PAGE, endCursor: cursor}),
    },
    cache: storefront.CacheShort(),
  });

  if (!collection) throw new Response('Not Found', {status: 404});
  return {collection, sortBy};
}

export function meta({data}: Route.MetaArgs) {
  if (!data?.collection) return [{title: 'Collection | Harpera'}];
  const title = `${data.collection.title} — Harpera`;
  const description = data.collection.description
    ? data.collection.description.slice(0, 155)
    : `Shop our ${data.collection.title} collection at Harpera.`;
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    ...(data.collection.image?.url
      ? [{property: 'og:image', content: data.collection.image.url}]
      : []),
  ];
}

export default function CollectionPage({loaderData}: Route.ComponentProps) {
  const {collection, sortBy} = loaderData;
  const {products} = collection;
  const [filterOpen, setFilterOpen] = useState(false);

  const availableFilters = (products as any).filters as Filter[] ?? [];

  // D.1: productsCount unavailable on this store's API.
  // Availability filter (BOOLEAN type or id 'filter.p.available') is always
  // in_stock + out_of_stock = all products → exact total.
  // Otherwise fall back to first LIST filter sum (over-count if multi-valued),
  // then to current page count.
  function deriveTotal(): number {
    const boolFilter = availableFilters.find(
      (f) => f.type === 'BOOLEAN' || f.id === 'filter.p.available',
    );
    if (boolFilter && boolFilter.values.length > 0) {
      return boolFilter.values.reduce((sum, v) => sum + v.count, 0);
    }
    return products.nodes.length;
  }
  const totalCount = deriveTotal();

  return (
    <>
      <style>{`
        .collection-section { padding-bottom: 27px; }
        @media screen and (min-width: 750px) {
          .collection-section { padding-bottom: 36px; }
        }
        .collection-content-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .collection-products-column { flex: 1; min-width: 0; }
        #product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 16px;
          list-style: none;
          padding: 0;
          margin: 24px 0 0;
        }
        @media screen and (min-width: 750px) {
          #product-grid { grid-template-columns: repeat(3, 1fr); gap: 24px 20px; }
        }
        @media screen and (min-width: 990px) {
          #product-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .product-card-wrapper .full-unstyled-link:hover { text-decoration: underline; }
        .button-wishlist:hover svg { fill: #1b466f; }
      `}</style>

      <div
        className="color-background-1 gradient"
        style={{
          backgroundColor: 'rgb(255,255,255)',
          fontFamily: 'Poppins, sans-serif',
          color: 'rgba(18,18,18,0.75)',
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.6px',
        }}
      >
        <div className="collection-section">
          {/* D.1/D.4: Toolbar with real count, sort, filter chips, mobile filter button */}
          <CollectionToolbar
            title={collection.title}
            sortBy={sortBy as SortByValue}
            totalCount={totalCount}
            filters={availableFilters}
            hasFilters={availableFilters.length > 0}
            onFilterToggle={() => setFilterOpen((v) => !v)}
          />

          <div
            id="ProductGridContainer"
            className="product-grid-container"
            style={{maxWidth: '1440px', margin: '0 auto', padding: '0 13px'}}
          >
            <div className="collection-content-layout">
              {/* D.3: Faceted filter sidebar (desktop) + mobile drawer */}
              {availableFilters.length > 0 && (
                <CollectionFilters
                  filters={availableFilters}
                  isOpen={filterOpen}
                  onClose={() => setFilterOpen(false)}
                />
              )}

              <div className="collection-products-column">
                {products.nodes.length > 0 ? (
                  <ul
                    id="product-grid"
                    className="grid product-grid grid--2-col-tablet-down grid--4-col-desktop"
                  >
                    {(products.nodes as ProductNode[]).map((product, i) => (
                      <li
                        key={product.id}
                        className="grid__item scroll-trigger animate--slide-in"
                        style={{'--animation-order': i + 1} as React.CSSProperties}
                      >
                        <CollectionProductCard product={product} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    style={{
                      textAlign: 'center', padding: '96px 0',
                      fontSize: '16px', color: 'rgba(18,18,18,0.45)', letterSpacing: '0.6px',
                    }}
                  >
                    No products found.
                  </p>
                )}

                <CollectionPagination
                  pageInfo={products.pageInfo}
                  sortBy={sortBy as SortByValue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
