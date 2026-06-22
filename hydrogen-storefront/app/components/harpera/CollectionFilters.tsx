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
