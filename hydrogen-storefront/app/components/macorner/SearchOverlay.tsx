import {Link, useFetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {SearchIcon} from './icons';

type Props = {
  goToSearch: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export function MacornerSearchOverlay({
  goToSearch,
  inputRef,
  containerRef,
}: Props) {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});

  const data = fetcher.data;
  const term = data?.term ?? '';
  const items = data?.result?.items;

  const queries = items?.queries ?? [];
  const collections = items?.collections ?? [];
  const products = items?.products ?? [];

  const isOpen = term.length > 0 && !!data;

  // Close on click outside the search container
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearInput();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, containerRef]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') clearInput();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  function clearInput() {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.blur();
    }
    void fetcher.submit(
      {q: '', limit: 5, predictive: true},
      {method: 'GET', action: '/search'},
    );
  }

  function handleChipClick(chipTerm: string) {
    if (inputRef.current) {
      inputRef.current.value = chipTerm;
      inputRef.current.focus();
    }
    void fetcher.submit(
      {q: chipTerm, limit: 5, predictive: true},
      {method: 'GET', action: '/search'},
    );
  }

  if (!isOpen) return null;

  const searchUrl = `/search?q=${encodeURIComponent(term)}`;
  const hasProducts = products.length > 0;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 border-t border-gray-100"
      role="dialog"
      aria-label="Search results"
    >
      {hasProducts ? (
        /* ── Two-column layout: results found ── */
        <div className="flex">
          {/* Left column — suggestions + categories + CTA */}
          <div className="w-[220px] shrink-0 border-r border-gray-100 p-5 flex flex-col gap-6">
            {queries.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#888] mb-3">
                  Popular Suggestions
                </p>
                <ul className="flex flex-col gap-2">
                  {queries.map((q) => {
                    const queryUrl = urlWithTrackingParams({
                      baseUrl: '/search',
                      trackingParams: q.trackingParameters,
                      term: q.text,
                    });
                    return (
                      <li key={q.text}>
                        <Link
                          to={queryUrl}
                          onClick={() => clearInput()}
                          className="flex items-center gap-2 text-[14px] text-[#333] hover:text-[#FC6514] transition-colors"
                        >
                          <SearchIcon
                            width={14}
                            height={14}
                            className="shrink-0 text-[#888]"
                          />
                          <span>{q.text}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {collections.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#888] mb-3">
                  Categories
                </p>
                <ul className="flex flex-col gap-2">
                  {collections.map((c) => {
                    const collectionUrl = urlWithTrackingParams({
                      baseUrl: `/collections/${c.handle}`,
                      trackingParams: c.trackingParameters,
                      term,
                    });
                    return (
                      <li key={c.id}>
                        <Link
                          to={collectionUrl}
                          onClick={() => clearInput()}
                          className="text-[14px] text-[#333] hover:text-[#FC6514] transition-colors"
                        >
                          {c.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-auto">
              <Link
                to={searchUrl}
                onClick={() => clearInput()}
                className="block w-full py-3 bg-black text-white text-[12px] font-bold uppercase tracking-[1px] text-center hover:bg-[#222] transition-colors"
              >
                See All Products →
              </Link>
            </div>
          </div>

          {/* Right column — products */}
          <div className="flex-1 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#888] mb-4">
              Products
            </p>
            <ul className="flex flex-col gap-4">
              {products.slice(0, 3).map((product) => {
                const variant = product.selectedOrFirstAvailableVariant;
                const compareAtPrice = (
                  variant as unknown as {
                    compareAtPrice?: {amount: string; currencyCode: string} | null;
                  }
                )?.compareAtPrice;
                const productUrl = urlWithTrackingParams({
                  baseUrl: `/products/${product.handle}`,
                  trackingParams: product.trackingParameters,
                  term,
                });
                const hasCompare =
                  compareAtPrice &&
                  Number(compareAtPrice.amount) > Number(variant?.price?.amount);

                return (
                  <li key={product.id}>
                    <Link
                      to={productUrl}
                      onClick={() => clearInput()}
                      className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                    >
                      {variant?.image && (
                        <div className="shrink-0 w-[80px] h-[80px] bg-gray-50 overflow-hidden">
                          <Image
                            alt={variant.image.altText ?? product.title}
                            src={variant.image.url}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#121212] line-clamp-2">
                          {product.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {variant?.price && (
                            <span className="text-[13px] text-[#FC6514] font-medium">
                              <Money data={variant.price} />
                            </span>
                          )}
                          {hasCompare && compareAtPrice && (
                            <span className="text-[12px] text-[#888] line-through">
                              {compareAtPrice.currencyCode === 'USD'
                                ? `$${Number(compareAtPrice.amount).toFixed(2)}`
                                : `${compareAtPrice.currencyCode} ${compareAtPrice.amount}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        /* ── Single-column layout: nothing found ── */
        <div className="px-8 py-6 flex flex-col gap-4">
          <p className="text-[15px] text-[#121212]">
            Sorry, nothing found for <strong>{term}</strong>.
          </p>

          {queries.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-[14px] text-[#121212]">
                Check out some of these popular searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {queries.map((q) => (
                  <button
                    key={q.text}
                    type="button"
                    onClick={() => handleChipClick(q.text)}
                    className="px-4 py-[7px] border border-[#c8cdd3] rounded text-[14px] text-[#121212] hover:border-[#FC6514] hover:text-[#FC6514] transition-colors"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Link
              to={searchUrl}
              onClick={() => clearInput()}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#1a1a2e] text-white text-[12px] font-bold uppercase tracking-[1px] hover:bg-[#2a2a4e] transition-colors"
            >
              See All Products
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
