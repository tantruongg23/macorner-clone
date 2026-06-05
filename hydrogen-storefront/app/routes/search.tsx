import type {Route} from './+types/search';
import {getEmptyPredictiveSearchResult, type PredictiveSearchReturn} from '~/lib/search';

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const term = url.searchParams.get('q') ?? '';
  const limit = Number(url.searchParams.get('limit') ?? 10);
  const isPredictive = url.searchParams.get('predictive') === 'true';

  if (!isPredictive) {
    return {type: 'page' as const, term};
  }

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

export default function SearchPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Search</h1>
    </div>
  );
}

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
