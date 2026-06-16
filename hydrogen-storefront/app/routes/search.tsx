import {Link, useNavigate} from 'react-router';
import type {Route} from './+types/search';

export function meta({location}: Route.MetaArgs) {
  const q = new URLSearchParams(location.search).get('q') ?? '';
  return [
    {title: q ? `Search: "${q}" — Harpera` : 'Search — Harpera'},
    {name: 'description', content: 'Search for personalized gifts at Harpera.'},
    {name: 'robots', content: 'noindex'},
  ];
}
import {
  getEmptyPredictiveSearchResult,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {CollectionProductCard} from '~/components/harpera/CollectionProductCard';
import type {ProductNode} from '~/types/collection';

// ─── Sort options available on the Storefront search API ──────────────────────
type SearchSortKey = 'RELEVANCE' | 'PRICE' | 'PUBLISHED_AT';

const SEARCH_SORT_OPTIONS: Array<{
  label: string;
  sortKey: SearchSortKey;
  reverse: boolean;
  value: string;
}> = [
  {label: 'Most relevant', sortKey: 'RELEVANCE', reverse: false, value: 'relevance'},
  {label: 'Price: Low to High', sortKey: 'PRICE', reverse: false, value: 'price-asc'},
  {label: 'Price: High to Low', sortKey: 'PRICE', reverse: true, value: 'price-desc'},
  {label: 'Date: New to Old', sortKey: 'PUBLISHED_AT', reverse: true, value: 'newest'},
  {label: 'Date: Old to New', sortKey: 'PUBLISHED_AT', reverse: false, value: 'oldest'},
];

// ─── Loader ───────────────────────────────────────────────────────────────────
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const term = url.searchParams.get('q') ?? '';
  const isPredictive = url.searchParams.get('predictive') === 'true';
  const limit = Number(url.searchParams.get('limit') ?? 10);

  // Predictive search path (used by the search overlay)
  if (isPredictive) {
    if (!term) {
      return {
        type: 'predictive' as const,
        term: '',
        result: getEmptyPredictiveSearchResult(),
      } satisfies PredictiveSearchReturn;
    }

    const {predictiveSearch} = await context.storefront.query(
      PREDICTIVE_SEARCH_QUERY,
      {
        variables: {
          term,
          limit,
          limitScope: 'EACH' as const,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
        cache: context.storefront.CacheNone(),
      },
    );

    const emptyItems = getEmptyPredictiveSearchResult().items;
    const items = (predictiveSearch ?? emptyItems) as PredictiveSearchReturn['result']['items'];
    const total = Object.values(items).reduce(
      (acc: number, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
      0,
    );

    return {
      type: 'predictive' as const,
      term,
      result: {items, total},
    } satisfies PredictiveSearchReturn;
  }

  // Full page search results
  const sortValue = url.searchParams.get('sort') ?? 'relevance';
  const cursor = url.searchParams.get('cursor') ?? undefined;

  const sortOption =
    SEARCH_SORT_OPTIONS.find((o) => o.value === sortValue) ??
    SEARCH_SORT_OPTIONS[0];

  if (!term) {
    return {
      type: 'page' as const,
      term: '',
      results: null,
      totalCount: 0,
      sortValue,
      pageInfo: null,
    };
  }

  const {search} = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      term,
      first: 24,
      after: cursor,
      sortKey: sortOption.sortKey,
      reverse: sortOption.reverse,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: context.storefront.CacheNone(),
  });

  return {
    type: 'page' as const,
    term,
    results: (search?.nodes ?? []) as ProductNode[],
    totalCount: search?.totalCount ?? 0,
    sortValue,
    pageInfo: search?.pageInfo ?? null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SearchPage({loaderData}: Route.ComponentProps) {
  // Predictive search responses are consumed by the overlay, not this component
  if (loaderData.type === 'predictive') return null;

  const {term, results, totalCount, sortValue, pageInfo} = loaderData;

  return (
    <div
      style={{fontFamily: 'Poppins, sans-serif'}}
      className="max-w-[1440px] mx-auto px-4 min-[990px]:px-8 py-8"
    >
      {/* Search header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-[rgb(18,18,18)] tracking-[0.4px] m-0 mb-1">
          {term ? (
            <>
              Search results for <span className="text-[#2e6ca6]">"{term}"</span>
            </>
          ) : (
            'Search'
          )}
        </h1>
        {term && (
          <p className="text-[14px] text-[rgba(18,18,18,0.55)] m-0">
            {totalCount} product{totalCount !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Search input (re-search bar) */}
      <form
        method="get"
        className="mb-8 flex gap-3 max-w-[560px]"
        action="/search"
      >
        <input
          type="search"
          name="q"
          defaultValue={term}
          placeholder="Search products…"
          className="flex-1 border border-[var(--color-header-border)] rounded-[10px] px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#2e6ca6] transition-colors"
          autoFocus={!term}
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-[10px] bg-[#2e6ca6] text-white text-[14px] font-semibold hover:bg-[#e0830e] transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {!term ? (
        <PopularCollections />
      ) : results && results.length > 0 ? (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-[14px] text-[rgba(18,18,18,0.6)] m-0">
              {totalCount} result{totalCount !== 1 ? 's' : ''}
            </p>
            <SortDropdown term={term} sortValue={sortValue} />
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[990px]:grid-cols-4 gap-4 mb-10">
            {results.map((product) => (
              <CollectionProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pageInfo?.hasNextPage && (
            <div className="flex justify-center">
              <Link
                to={`/search?q=${encodeURIComponent(term)}&sort=${sortValue}&cursor=${pageInfo.endCursor}`}
                className="px-8 py-3 rounded-[10px] border border-[#2e6ca6] text-[#2e6ca6] text-[14px] font-semibold hover:bg-[#2e6ca6] hover:text-white transition-colors"
              >
                Load more
              </Link>
            </div>
          )}
        </>
      ) : (
        <NoResults term={term} />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SortDropdown({
  term,
  sortValue,
}: {
  term: string;
  sortValue: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="search-sort"
        className="text-[13px] text-[rgba(18,18,18,0.55)]"
      >
        Sort by:
      </label>
      <select
        id="search-sort"
        value={sortValue}
        onChange={(e) =>
          navigate(
            `/search?q=${encodeURIComponent(term)}&sort=${e.target.value}`,
          )
        }
        className="border border-[var(--color-header-border)] rounded-[8px] px-3 py-1.5 text-[13px] text-[rgb(18,18,18)] focus:outline-none focus:border-[#2e6ca6] bg-white transition-colors cursor-pointer"
      >
        {SEARCH_SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NoResults({term}: {term: string}) {
  return (
    <div className="text-center py-16">
      <p className="text-[18px] font-medium text-[rgb(18,18,18)] mb-2">
        No results for "{term}"
      </p>
      <p className="text-[14px] text-[rgba(18,18,18,0.55)] mb-8 max-w-[420px] mx-auto">
        Try checking your spelling or using different keywords.
      </p>
      <PopularCollections />
    </div>
  );
}

function PopularCollections() {
  const links = [
    {label: 'All products', handle: 'all'},
    {label: 'Best sellers', handle: 'best-sellers'},
    {label: 'New arrivals', handle: 'new-arrivals'},
  ];

  return (
    <div>
      <p className="text-[13px] uppercase tracking-[0.8px] font-medium text-[rgba(18,18,18,0.5)] mb-4">
        Popular collections
      </p>
      <div className="flex flex-wrap gap-3">
        {links.map((l) => (
          <Link
            key={l.handle}
            to={`/collections/${l.handle}`}
            className="px-5 py-2 rounded-full border border-[var(--color-header-border)] text-[14px] text-[rgb(18,18,18)] hover:border-[#2e6ca6] hover:text-[#2e6ca6] transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── GraphQL ──────────────────────────────────────────────────────────────────
const SEARCH_QUERY = `#graphql
  query Search(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
    $term: String!
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $after: String
  ) @inContext(country: $country, language: $language) {
    search(
      query: $term
      first: $first
      sortKey: $sortKey
      reverse: $reverse
      after: $after
      types: [PRODUCT]
    ) {
      totalCount
      nodes {
        ... on Product {
          id
          title
          handle
          availableForSale
          tags
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            nodes {
              id
              availableForSale
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  #graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }

  #graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }

  #graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }

  #graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
  }

  #graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }

` as const;
