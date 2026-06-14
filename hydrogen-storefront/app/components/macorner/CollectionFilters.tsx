import {Link, useSearchParams} from 'react-router';
import type {Filter} from '~/types/collection';

interface Props {
  filters: Filter[];
  isOpen: boolean;
  onClose: () => void;
}

export function CollectionFilters({filters, isOpen, onClose}: Props) {
  const [searchParams] = useSearchParams();

  function isValueActive(filterId: string, inputJson: string): boolean {
    return searchParams.getAll(filterId).includes(inputJson);
  }

  function buildToggleUrl(filterId: string, inputJson: string): string {
    const p = new URLSearchParams(searchParams);
    p.delete('cursor');
    p.delete('prev');
    const current = p.getAll(filterId);
    const active = current.includes(inputJson);
    p.delete(filterId);
    if (active) {
      current.filter((v) => v !== inputJson).forEach((v) => p.append(filterId, v));
    } else {
      current.forEach((v) => p.append(filterId, v));
      p.append(filterId, inputJson);
    }
    const str = p.toString();
    return str ? `?${str}` : '?';
  }

  if (filters.length === 0) return null;

  return (
    <>
      <style>{`
        .cf-backdrop {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 50;
        }
        .cf-backdrop.is-open { display: block; }
        @media (min-width: 990px) { .cf-backdrop { display: none !important; } }

        .cf-panel {
          position: fixed;
          top: 0; left: 0;
          width: 290px; height: 100vh;
          background: #fff;
          z-index: 51;
          overflow-y: auto;
          padding: 20px 16px 40px;
          box-shadow: 2px 0 12px rgba(0,0,0,0.12);
          transform: translateX(-100%);
          transition: transform 0.28s ease;
          font-family: Poppins, sans-serif;
        }
        .cf-panel.is-open { transform: translateX(0); }
        @media (min-width: 990px) {
          .cf-panel {
            position: sticky;
            top: 20px;
            width: 220px;
            height: auto;
            max-height: calc(100vh - 40px);
            overflow-y: auto;
            transform: none !important;
            box-shadow: none;
            padding: 0 0 40px;
            flex-shrink: 0;
          }
        }

        .cf-mobile-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(18,18,18,0.1);
        }
        @media (min-width: 990px) { .cf-mobile-header { display: none; } }

        .cf-close-btn {
          background: none; border: none; cursor: pointer;
          padding: 4px; color: rgba(18,18,18,0.6); font-size: 18px; line-height: 1;
        }
        .cf-close-btn:hover { color: rgb(18,18,18); }

        .cf-group { border-bottom: 1px solid rgba(18,18,18,0.1); }
        .cf-group summary {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0;
          font-size: 13px; font-weight: 600; color: rgb(18,18,18);
          letter-spacing: 0.4px; cursor: pointer; list-style: none;
          user-select: none;
        }
        .cf-group summary::-webkit-details-marker { display: none; }
        .cf-group summary::after {
          content: '+'; font-size: 16px; font-weight: 400;
          color: rgba(18,18,18,0.5); transition: transform 0.2s;
        }
        .cf-group[open] summary::after { content: '−'; }

        .cf-values {
          list-style: none; padding: 0 0 12px; margin: 0;
          display: flex; flex-direction: column; gap: 6px;
        }

        .cf-value-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: rgba(18,18,18,0.75);
          letter-spacing: 0.4px; text-decoration: none;
          padding: 3px 0; cursor: pointer;
        }
        .cf-value-link:hover { color: rgb(18,18,18); }

        .cf-checkbox {
          width: 16px; height: 16px; flex-shrink: 0;
          border: 1.5px solid rgba(18,18,18,0.3); border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, border-color 0.15s;
        }
        .cf-value-link.is-active .cf-checkbox {
          background: rgb(30,78,121); border-color: rgb(30,78,121);
        }
        .cf-checkbox-tick {
          display: none; width: 10px; height: 10px;
          stroke: #fff; stroke-width: 2.5; fill: none;
        }
        .cf-value-link.is-active .cf-checkbox-tick { display: block; }

        .cf-count {
          margin-left: auto;
          font-size: 11px; color: rgba(18,18,18,0.45); letter-spacing: 0.3px;
        }
      `}</style>

      {/* Mobile backdrop */}
      <div
        className={`cf-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Filter panel */}
      <div
        className={`cf-panel${isOpen ? ' is-open' : ''}`}
        aria-label="Collection filters"
      >
        {/* Mobile header */}
        <div className="cf-mobile-header">
          <span style={{fontSize: '14px', fontWeight: 600, color: 'rgb(18,18,18)', letterSpacing: '0.5px'}}>
            Filters
          </span>
          <button className="cf-close-btn" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        </div>

        {filters.map((filter) => (
          <details key={filter.id} className="cf-group" open>
            <summary>{filter.label}</summary>
            <ul className="cf-values">
              {filter.values.map((value) => {
                const active = isValueActive(filter.id, value.input);
                return (
                  <li key={value.id}>
                    <Link
                      to={buildToggleUrl(filter.id, value.input)}
                      className={`cf-value-link${active ? ' is-active' : ''}`}
                      preventScrollReset
                      replace
                    >
                      <span className="cf-checkbox" aria-hidden="true">
                        <svg className="cf-checkbox-tick" viewBox="0 0 10 8">
                          <polyline points="1,4 4,7 9,1" />
                        </svg>
                      </span>
                      <span>{value.label}</span>
                      <span className="cf-count">({value.count.toLocaleString('en-US')})</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </>
  );
}
