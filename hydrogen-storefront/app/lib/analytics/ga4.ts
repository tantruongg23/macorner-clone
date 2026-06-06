import {useEffect} from 'react';
import {
  useAnalytics,
  AnalyticsEvent,
  type PageViewPayload,
  type ProductViewPayload,
  type CartLineUpdatePayload,
} from '@shopify/hydrogen';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(args);
}

export function GA4Analytics({measurementId}: {measurementId: string}) {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('GA4Analytics');

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') {
      ready();
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = gtag as typeof window.gtag;
    gtag('js', new Date());
    gtag('config', measurementId, {send_page_view: false});

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    subscribe(AnalyticsEvent.PAGE_VIEWED, (payload: PageViewPayload) => {
      window.gtag?.('event', 'page_view', {page_location: payload.url});
    });

    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (payload: ProductViewPayload) => {
      const p = payload.products[0];
      if (!p) return;
      window.gtag?.('event', 'view_item', {
        currency: 'USD',
        items: [{item_id: p.variantId, item_name: p.title, price: p.price}],
      });
    });

    subscribe(
      AnalyticsEvent.PRODUCT_ADD_TO_CART,
      (payload: CartLineUpdatePayload) => {
        const line = payload.currentLine;
        if (!line) return;
        window.gtag?.('event', 'add_to_cart', {
          currency: line.cost?.totalAmount?.currencyCode ?? 'USD',
          value: parseFloat(line.cost?.totalAmount?.amount ?? '0'),
          items: [
            {
              item_id: line.merchandise?.id,
              item_name: line.merchandise?.product?.title,
              quantity: line.quantity,
              price: parseFloat(
                line.merchandise?.price?.amount ?? '0',
              ),
            },
          ],
        });
      },
    );

    ready();
  }, [measurementId, subscribe, register, ready]);

  return null;
}
