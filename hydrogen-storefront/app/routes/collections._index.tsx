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
  return [{title: 'Collections | Macorner'}];
}

export default function CollectionsIndex({loaderData}: Route.ComponentProps) {
  const {collections} = loaderData;

  return (
    <>
      <style>{`
        .collections-index { font-family: Poppins, sans-serif; background:#fff; }
        .collections-index__title {
          font-size: 28px; font-weight: 600; letter-spacing: 0.6px;
          color: rgb(18,18,18); text-align:center; margin: 0 0 32px;
        }
        @media (min-width: 750px) { .collections-index__title { font-size: 40px; } }
        .collections-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 24px 16px; list-style: none; padding: 0; margin: 0;
        }
        @media (min-width: 750px) { .collections-grid { grid-template-columns: repeat(3, 1fr); gap: 32px 24px; } }
        @media (min-width: 990px) { .collections-grid { grid-template-columns: repeat(4, 1fr); } }
        .collection-tile__media {
          aspect-ratio: 1 / 1; overflow: hidden; border-radius: 10px;
          background:#f4f4f4; display:flex; align-items:center; justify-content:center;
        }
        .collection-tile__media img { width:100%; height:100%; object-fit: cover; transition: transform .4s ease; }
        .collection-tile:hover .collection-tile__media img { transform: scale(1.05); }
        .collection-tile__title {
          margin: 12px 0 0; text-align:center; font-size: 15px; font-weight: 500;
          letter-spacing: 0.4px; color: rgb(18,18,18);
        }
        .collection-tile:hover .collection-tile__title { color:#1e4e79; }
      `}</style>

      <div className="collections-index">
        <div style={{maxWidth: '1440px', margin: '0 auto', padding: '40px 13px 64px'}}>
          <h1 className="collections-index__title">Collections</h1>

          <ul className="collections-grid">
            {(collections.nodes as CollectionNode[]).map((collection) => (
              <li key={collection.id}>
                <Link to={`/collections/${collection.handle}`} className="collection-tile block">
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
                className="inline-block px-7 py-3 rounded-[10px] bg-[#1e4e79] text-white text-[15px] font-semibold tracking-[0.6px] hover:bg-[#122e49] transition-colors"
              >
                Load more
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
