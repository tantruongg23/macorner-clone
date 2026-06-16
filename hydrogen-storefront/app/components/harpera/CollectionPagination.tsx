import {Link, useSearchParams} from 'react-router';
import type {PageInfo, SortByValue} from '~/types/collection';

type Props = {
  pageInfo: PageInfo;
  sortBy: SortByValue;
};

const dotBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '34px', height: '35px', maxWidth: '34px',
  fontSize: '16px', letterSpacing: '0.6px',
  borderRadius: '4px', border: '1px solid rgba(18,18,18,0.2)',
  color: 'rgba(18,18,18,0.75)', textDecoration: 'none',
  transition: 'border-color 0.2s, color 0.2s', flexShrink: 0,
};

const dotActive: React.CSSProperties = {
  ...dotBase,
  backgroundColor: 'rgb(241,101,35)', borderColor: 'rgb(241,101,35)',
  color: '#fff', fontWeight: '600', cursor: 'default',
};

const dotDisabled: React.CSSProperties = {
  ...dotBase,
  color: 'rgba(18,18,18,0.25)', borderColor: 'rgba(18,18,18,0.08)',
  cursor: 'not-allowed',
};

function ChevronLeft() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden width="16" height="16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden width="16" height="16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function CollectionPagination({pageInfo, sortBy}: Props) {
  const [searchParams] = useSearchParams();
  const hasPrev = pageInfo.hasPreviousPage;
  const hasNext = pageInfo.hasNextPage;

  if (!hasPrev && !hasNext) return null;

  function buildUrl(type: 'next' | 'prev') {
    const p = new URLSearchParams(searchParams);
    if (sortBy !== 'manual') p.set('sort_by', sortBy);
    if (type === 'next') {
      p.set('cursor', pageInfo.endCursor ?? '');
      p.delete('prev');
    } else {
      p.set('prev', pageInfo.startCursor ?? '');
      p.delete('cursor');
    }
    return `?${p.toString()}`;
  }


  return (
    <div className="pagination-wrapper" style={{margin: '50px 0 15px'}}>
      <nav className="pagination" aria-label="Pagination">
        <ul
          className="pagination__list list-unstyled"
          style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'center', listStyle: 'none', padding: 0, margin: 0,
          }}
        >
          <li style={{maxWidth: '34px', marginRight: '10px'}}>
            {hasPrev ? (
              <Link to={buildUrl('prev')} style={dotBase} aria-label="Previous page">
                <ChevronLeft />
              </Link>
            ) : (
              <span style={dotDisabled} aria-disabled="true"><ChevronLeft /></span>
            )}
          </li>

          <li style={{maxWidth: '34px', marginRight: '10px'}}>
            <span style={dotActive} aria-current="page">
              {hasPrev ? '…' : '1'}
            </span>
          </li>

          <li style={{maxWidth: '34px'}}>
            {hasNext ? (
              <Link to={buildUrl('next')} style={dotBase} aria-label="Next page">
                <ChevronRight />
              </Link>
            ) : (
              <span style={dotDisabled} aria-disabled="true"><ChevronRight /></span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
