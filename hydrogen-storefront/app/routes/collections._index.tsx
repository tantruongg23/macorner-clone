import type {Route} from './+types/collections._index';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

type CollectionNode = {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

const COLLECTIONS_INDEX_QUERY = `#graphql
  query CollectionsIndex($first: Int!, $after: String) {
    collections(first: $first, after: $after, sortKey: TITLE) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;

export async function loader({request, context}: Route.LoaderArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const after = url.searchParams.get('cursor') ?? undefined;

  const {collections} = await storefront.query(COLLECTIONS_INDEX_QUERY, {
    variables: {first: 48, after},
    cache: storefront.CacheShort(),
  });

  return {collections};
}

export function meta() {
  return [{title: 'Collections | Harpera'}];
}

export default function CollectionsIndex({loaderData}: Route.ComponentProps) {
  const {collections} = loaderData;

  return (
    <div className="collections-index">
        <div style={{maxWidth: '1440px', margin: '0 auto', padding: '40px 13px 64px'}}>
          <h1 className="collections-index__title">Collections</h1>

          <ul className="collections-grid">
            {(collections.nodes as CollectionNode[]).map((collection) => (
              <li key={collection.id}>
                <Link to={`/collections/${collection.handle}`} prefetch="intent" className="collection-tile block">
                  <div className="collection-tile__media">
                    {collection.image ? (
                      <Image
                        data={collection.image}
                        sizes="(min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw"
                        loading="lazy"
                      />
                    ) : (
                      <span style={{color: 'rgba(18,18,18,0.3)', fontSize: 14}}>
                        {collection.title}
                      </span>
                    )}
                  </div>
                  <p className="collection-tile__title">{collection.title}</p>
                </Link>
              </li>
            ))}
          </ul>

          {collections.pageInfo.hasNextPage && collections.pageInfo.endCursor ? (
            <div style={{textAlign: 'center', marginTop: 48}}>
              <Link
                to={`?cursor=${collections.pageInfo.endCursor}`}
                prefetch="intent"
                className="inline-block px-7 py-3 rounded-[10px] bg-[#1e4e79] text-white text-[15px] font-semibold tracking-[0.6px] hover:bg-[#122e49] transition-colors"
              >
                Load more
              </Link>
            </div>
          ) : null}
        </div>
    </div>
  );
}
