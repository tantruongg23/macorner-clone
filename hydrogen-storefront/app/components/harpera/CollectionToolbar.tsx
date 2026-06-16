import {Link, useNavigate, useSearchParams} from 'react-router';
import {SORT_OPTIONS} from '~/types/collection';
import type {Filter, FilterValue, SortByValue, SortOption} from '~/types/collection';

type Props = {
  title: string;
  sortBy: SortByValue;
  totalCount: number;
  filters?: Filter[];
  hasFilters?: boolean;
  onFilterToggle?: () => void;
};

export function CollectionToolbar({
  title,
  sortBy,
  totalCount,
  filters = [],
  hasFilters = false,
  onFilterToggle,
}: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function buildSortUrl(value: string) {
    const p = new URLSearchParams(searchParams);
    if (value === 'manual') p.delete('sort_by');
    else p.set('sort_by', value);
    p.delete('cursor');
    p.delete('prev');
    return `?${p.toString()}`;
  }

  function buildClearFiltersUrl(): string {
    const p = new URLSearchParams(searchParams);
    for (const key of [...p.keys()]) {
      if (key.startsWith('filter.')) p.delete(key);
    }
    p.delete('cursor');
    p.delete('prev');
    const str = p.toString();
    return str ? `?${str}` : '?';
  }

  // Collect active filter chips: (filterId, value) pairs that are in the URL
  type Chip = {filterId: string; value: FilterValue; filterLabel: string};
  const activeChips: Chip[] = [];
  for (const filter of filters) {
    for (const value of filter.values) {
      if (searchParams.getAll(filter.id).includes(value.input)) {
        activeChips.push({filterId: filter.id, value, filterLabel: filter.label});
      }
    }
  }

  function buildRemoveChipUrl(filterId: string, inputJson: string): string {
    const p = new URLSearchParams(searchParams);
    p.delete('cursor');
    p.delete('prev');
    const current = p.getAll(filterId).filter((v) => v !== inputJson);
    p.delete(filterId);
    current.forEach((v) => p.append(filterId, v));
    const str = p.toString();
    return str ? `?${str}` : '?';
  }

  return (
    <>
      <style>{`
        .toolbar-filter-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: 1px solid rgba(18,18,18,0.2); border-radius: 4px;
          padding: 5px 12px; font-size: 13px; font-family: Poppins, sans-serif;
          color: rgb(18,18,18); cursor: pointer; letter-spacing: 0.4px;
          white-space: nowrap;
        }
        .toolbar-filter-btn:hover { border-color: rgba(18,18,18,0.5); }
        @media (min-width: 990px) { .toolbar-filter-btn { display: none; } }

        .toolbar-chips {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 10px 0 2px;
          max-width: 1440px; margin: 0 auto; padding-left: 13px; padding-right: 13px;
        }
        .toolbar-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(247,146,31,0.1); border: 1px solid rgba(247,146,31,0.4);
          border-radius: 20px; padding: 3px 10px;
          font-size: 12px; color: rgb(18,18,18); letter-spacing: 0.3px;
          text-decoration: none;
        }
        .toolbar-chip:hover { background: rgba(247,146,31,0.2); }
        .toolbar-chip-x { font-size: 14px; line-height: 1; color: rgba(18,18,18,0.5); }
        .toolbar-chip:hover .toolbar-chip-x { color: rgb(18,18,18); }
        .toolbar-clear-all {
          font-size: 12px; color: rgba(18,18,18,0.55); letter-spacing: 0.3px;
          text-decoration: underline; text-decoration-color: rgba(18,18,18,0.3);
          cursor: pointer; align-self: center;
          background: none; border: none; font-family: Poppins, sans-serif; padding: 0;
        }
        .toolbar-clear-all:hover { color: rgb(18,18,18); }
      `}</style>

      <aside
        aria-labelledby="verticalTitle"
        className="facets-wrapper page-width"
        id="main-collection-filters"
        style={{maxWidth: '1440px', margin: '0 auto', padding: '0 13px'}}
      >
        <div
          className="facets-container"
          style={{display: 'flex', alignItems: 'center', gap: '16px'}}
        >
          {/* Collection title */}
          <h3
            id="verticalTitle"
            className="name-collection-page"
            style={{
              fontSize: '16px', fontWeight: '600', color: 'rgb(18,18,18)',
              letterSpacing: '0.6px', lineHeight: '24px',
              margin: 0, whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {title}
          </h3>

          {/* Sort + filter controls row */}
          <form
            id="FacetFiltersForm"
            className="facets__form"
            style={{flex: 1, display: 'flex', alignItems: 'center'}}
          >
            <div
              className="facet-filters sorting caption"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%',
                borderTop: '1px solid rgba(18,18,18,0.08)',
                borderBottom: '1px solid rgba(18,18,18,0.08)',
                padding: '10px 0',
                gap: '12px',
              }}
            >
              {/* Mobile filter button */}
              {hasFilters && (
                <button
                  type="button"
                  className="toolbar-filter-btn"
                  onClick={onFilterToggle}
                  aria-expanded="false"
                  aria-controls="cf-panel"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Filter
                </button>
              )}

              {/* Sort by label + select */}
              <div className="facet-filters__field" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <label
                  htmlFor="SortBy"
                  className="facet-filters__label caption-large text-body"
                  style={{fontSize: '13px', color: 'rgba(18,18,18,0.6)', whiteSpace: 'nowrap', letterSpacing: '0.4px'}}
                >
                  Sort by:
                </label>
                <div className="select" style={{position: 'relative'}}>
                  <select
                    id="SortBy"
                    name="sort_by"
                    value={sortBy}
                    aria-label="Sort products"
                    className="facet-filters__sort select__select caption-large"
                    onChange={(e) => navigate(buildSortUrl(e.target.value))}
                    style={{
                      appearance: 'none', WebkitAppearance: 'none',
                      fontSize: '13px', color: 'rgb(18,18,18)',
                      backgroundColor: '#fff', border: '1px solid rgba(18,18,18,0.2)',
                      borderRadius: '4px', padding: '5px 26px 5px 10px',
                      cursor: 'pointer', minWidth: '160px',
                      letterSpacing: '0.4px', lineHeight: '20px',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {(Object.entries(SORT_OPTIONS) as [SortByValue, SortOption][]).map(([val, opt]) => (
                      <option key={val} value={val}>{opt.label}</option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="icon icon-caret"
                    viewBox="0 0 10 6"
                    style={{
                      position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                      width: '10px', height: '6px', pointerEvents: 'none', fill: 'rgba(18,18,18,0.5)',
                    }}
                  >
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Product count */}
              <div className="product-count light" role="status" style={{marginLeft: 'auto'}}>
                <p
                  className="product-count__text text-body"
                  style={{fontSize: '13px', color: 'rgba(18,18,18,0.6)', letterSpacing: '0.4px', margin: 0, whiteSpace: 'nowrap'}}
                >
                  {totalCount.toLocaleString('en-US')} {totalCount === 1 ? 'product' : 'products'}
                </p>
              </div>
            </div>
          </form>
        </div>
      </aside>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="toolbar-chips">
          {activeChips.map(({filterId, value, filterLabel}) => (
            <Link
              key={`${filterId}-${value.id}`}
              to={buildRemoveChipUrl(filterId, value.input)}
              className="toolbar-chip"
              preventScrollReset
              replace
              aria-label={`Remove filter: ${filterLabel} — ${value.label}`}
            >
              <span>{filterLabel}: {value.label}</span>
              <span className="toolbar-chip-x" aria-hidden="true">✕</span>
            </Link>
          ))}
          <Link
            to={buildClearFiltersUrl()}
            className="toolbar-clear-all"
            preventScrollReset
            replace
          >
            Clear all
          </Link>
        </div>
      )}
    </>
  );
}
