import type {Route} from './+types/collections.$handle';
import {SORT_OPTIONS} from '~/types/collection';
import type {SortByValue, ProductNode} from '~/types/collection';
import {CollectionToolbar} from '~/components/macorner/CollectionToolbar';
import {CollectionProductCard} from '~/components/macorner/CollectionProductCard';
import {CollectionPagination} from '~/components/macorner/CollectionPagination';

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
  ) {
    collection(handle: $handle) {
      id
      title
      description
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: $sortKey
        reverse: $reverse
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

  const url    = new URL(request.url);
  const sortBy = (url.searchParams.get('sort_by') ?? 'manual') as SortByValue;
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const prev   = url.searchParams.get('prev') ?? undefined;
  const opt    = SORT_OPTIONS[sortBy] ?? SORT_OPTIONS.manual;

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      sortKey: opt.key as any,
      reverse: opt.reverse,
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
  if (!data?.collection) return [{title: 'Collection | Macorner'}];
  return [{title: `${data.collection.title} | Macorner`}];
}

export default function CollectionPage({loaderData}: Route.ComponentProps) {
  const {collection, sortBy} = loaderData;
  const {products} = collection;

  return (
    <>
      <style>{`
        .collection-section { padding-top: 27px; padding-bottom: 27px; }
        @media screen and (min-width: 750px) {
          .collection-section { padding-top: 36px; padding-bottom: 36px; }
        }
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
          #product-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .product-card-wrapper .full-unstyled-link:hover { text-decoration: underline; }
        .button-wishlist:hover svg { fill: #F16523; }
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

          <CollectionToolbar
            title={collection.title}
            sortBy={sortBy as SortByValue}
            totalCount={products.nodes.length}
          />

          <div
            id="ProductGridContainer"
            className="product-grid-container"
            style={{maxWidth: '1440px', margin: '0 auto', padding: '0 13px'}}
          >
            <div className="collection page-width">
              {products.nodes.length > 0 ? (
                <ul id="product-grid" className="grid product-grid grid--2-col-tablet-down grid--4-col-desktop">
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
                <p style={{textAlign: 'center', padding: '96px 0', fontSize: '16px', color: 'rgba(18,18,18,0.45)', letterSpacing: '0.6px'}}>
                  No products found.
                </p>
              )}
            </div>

            <CollectionPagination
              pageInfo={products.pageInfo}
              sortBy={sortBy as SortByValue}
            />
          </div>

        </div>
      </div>
    </>
  );
}
