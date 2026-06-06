import {useEffect} from 'react';

declare global {
  interface Window {
    jdgm?: {init?: () => void};
  }
}

export function ProductReviews({
  productId,
  productHandle,
}: {
  productId: string;
  productHandle: string;
}) {
  // Extract numeric Shopify product ID from GID (e.g. "gid://shopify/Product/123" → "123")
  const numericId = productId.split('/').pop() ?? productId;

  useEffect(() => {
    if (!document.getElementById('judgeme-js-loader')) {
      const script = document.createElement('script');
      script.id = 'judgeme-js-loader';
      script.src = '//judge.me/loader/current';
      script.async = true;
      document.head.appendChild(script);
    } else {
      // Script already present — ask Judge.me to re-scan the DOM for new widgets
      window.jdgm?.init?.();
    }
  }, [productHandle]);

  return (
    <section
      id="reviews"
      className="mt-14 pt-10 border-t border-[rgba(18,18,18,0.08)]"
    >
      <div
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
  return (
    <div
      className="jdgm-prev-badge"
      data-id={numericId}
      data-handle={productHandle}
    />
  );
}
