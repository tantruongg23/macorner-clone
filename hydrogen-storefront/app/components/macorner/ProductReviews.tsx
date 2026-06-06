import {useEffect, useRef, useState} from 'react';

declare global {
  interface Window {
    jdgm?: {init?: () => void};
  }
}

function StarOutline({size}: {size: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d3d3d3"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ProductReviews({
  productId,
  productHandle,
}: {
  productId: string;
  productHandle: string;
}) {
  const numericId = productId.split('/').pop() ?? productId;
  const [showSkeleton, setShowSkeleton] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById('judgeme-js-loader')) {
      const script = document.createElement('script');
      script.id = 'judgeme-js-loader';
      script.src = '//judge.me/loader/current';
      script.async = true;
      document.head.appendChild(script);
    } else {
      window.jdgm?.init?.();
    }
  }, [productHandle]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    const el = widgetRef.current;
    if (!el) return () => clearTimeout(timer);

    const observer = new MutationObserver(() => {
      if (el.childNodes.length > 0) {
        setShowSkeleton(false);
        observer.disconnect();
      }
    });
    observer.observe(el, {childList: true, subtree: true});

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [productHandle]);

  return (
    <section
      id="reviews"
      className="mt-14 pt-10 border-t border-[rgba(18,18,18,0.08)]"
    >
      {showSkeleton && (
        <div className="flex flex-col gap-3 pb-4" aria-hidden="true">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarOutline key={i} size={20} />
            ))}
          </div>
          <p className="text-[14px] text-[#aaa] m-0">Loading reviews…</p>
        </div>
      )}
      <div
        ref={widgetRef}
        className="jdgm-widget jdgm-review-widget"
        data-id={numericId}
        data-handle={productHandle}
      />
    </section>
  );
}

/** Inline star-badge for product cards. Judge.me script replaces this div with stars. */
export function JudgeMeStarBadge({
  productId,
  productHandle,
}: {
  productId: string;
  productHandle: string;
}) {
  const numericId = productId.split('/').pop() ?? productId;
  const [showSkeleton, setShowSkeleton] = useState(true);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    const el = badgeRef.current;
    if (!el) return () => clearTimeout(timer);

    const observer = new MutationObserver(() => {
      if (el.childNodes.length > 0) {
        setShowSkeleton(false);
        observer.disconnect();
      }
    });
    observer.observe(el, {childList: true, subtree: true});

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [productHandle]);

  return (
    <div className="relative min-h-[20px]">
      <div
        ref={badgeRef}
        className="jdgm-prev-badge"
        data-id={numericId}
        data-handle={productHandle}
      />
      {showSkeleton && (
        <div
          className="absolute top-0 left-0 flex items-center gap-[2px]"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <StarOutline key={i} size={13} />
          ))}
        </div>
      )}
    </div>
  );
}
