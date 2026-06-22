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
  if (!data?.page) return [{title: 'Page | Harpera'}];
  const title = data.page.seo?.title ?? `${data.page.title} | Harpera`;
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
    <div className="harpera-page">
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '40px 18px 64px',
          }}
        >
          <h1 className="harpera-page__title">{page.title}</h1>
          {page.body ? (
            <div
              className="harpera-rte"
              dangerouslySetInnerHTML={{__html: page.body}}
            />
          ) : null}
        </div>
    </div>
  );
}
