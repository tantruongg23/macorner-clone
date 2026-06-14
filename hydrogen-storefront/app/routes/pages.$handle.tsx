import type {Route} from './+types/pages.$handle';
import {PAGE_QUERY} from '~/lib/graphql/page';

export async function loader({params, context}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Response('Not Found', {status: 404});

  const {page} = await storefront.query(PAGE_QUERY, {
    variables: {handle},
    cache: storefront.CacheLong(),
  });

  if (!page) throw new Response('Not Found', {status: 404});
  return {page};
}

export function meta({data}: Route.MetaArgs) {
  if (!data?.page) return [{title: 'Page | Macorner'}];
  const title = data.page.seo?.title ?? `${data.page.title} | Macorner`;
  const description = data.page.seo?.description ?? '';
  return [
    {title},
    ...(description ? [{name: 'description', content: description}] : []),
    {property: 'og:title', content: title},
    {property: 'og:type', content: 'website'},
    ...(description
      ? [{property: 'og:description', content: description}]
      : []),
  ];
}

export default function Page({loaderData}: Route.ComponentProps) {
  const {page} = loaderData;

  return (
    <>
      <style>{`
        .macorner-page {
          font-family: Poppins, sans-serif;
          color: rgba(18, 18, 18, 0.75);
          background-color: #fff;
        }
        .macorner-page__title {
          font-size: 28px;
          line-height: 1.3;
          letter-spacing: 0.6px;
          font-weight: 600;
          color: rgb(18, 18, 18);
          text-align: center;
          margin: 0 0 24px;
        }
        @media screen and (min-width: 750px) {
          .macorner-page__title { font-size: 40px; }
        }
        .macorner-rte { font-size: 16px; line-height: 1.7; letter-spacing: 0.4px; }
        .macorner-rte h2 { font-size: 24px; line-height: 1.3; font-weight: 600; color: rgb(18,18,18); margin: 32px 0 16px; }
        .macorner-rte h3 { font-size: 20px; line-height: 1.3; font-weight: 600; color: rgb(18,18,18); margin: 24px 0 12px; }
        .macorner-rte p { margin: 0 0 16px; }
        .macorner-rte a { color: #1e4e79; text-decoration: underline; }
        .macorner-rte ul, .macorner-rte ol { margin: 0 0 16px; padding-left: 24px; }
        .macorner-rte li { margin-bottom: 8px; }
        .macorner-rte img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
        .macorner-rte table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .macorner-rte th, .macorner-rte td { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; }
        .macorner-rte strong { color: rgb(18,18,18); }
      `}</style>

      <div className="macorner-page">
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '40px 18px 64px',
          }}
        >
          <h1 className="macorner-page__title">{page.title}</h1>
          {page.body ? (
            <div
              className="macorner-rte"
              dangerouslySetInnerHTML={{__html: page.body}}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
