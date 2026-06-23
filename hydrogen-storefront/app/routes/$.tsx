import type {Route} from './+types/$';
import {Link} from 'react-router';

export async function loader({request}: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export function meta() {
  return [{title: 'Page not found | Harpera'}];
}

export default function CatchAllPage() {
  return null;
}

export function ErrorBoundary() {
  return (
    <div
      style={{
        fontFamily: 'Poppins, sans-serif',
        maxWidth: '720px',
        margin: '0 auto',
        padding: '96px 18px',
        textAlign: 'center',
      }}
    >
      <p style={{fontSize: 80, fontWeight: 700, color: '#1e4e79', margin: 0, lineHeight: 1}}>
        404
      </p>
      <h1 style={{fontSize: 26, fontWeight: 600, color: 'rgb(18,18,18)', margin: '16px 0 8px'}}>
        The page you were looking for doesn&apos;t exist.
      </h1>
      <p style={{fontSize: 16, color: 'rgba(18,18,18,0.6)', margin: '0 0 28px'}}>
        The link may be broken, or the page may have been removed.
      </p>
      <Link
        to="/"
        prefetch="intent"
        style={{
          display: 'inline-block',
          background: '#1e4e79',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.6px',
          padding: '12px 28px',
          borderRadius: 10,
          textDecoration: 'none',
        }}
      >
        Continue shopping
      </Link>
    </div>
  );
}
