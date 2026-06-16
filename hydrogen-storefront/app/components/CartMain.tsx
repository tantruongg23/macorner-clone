import {useOptimisticCart, CartForm} from '@shopify/hydrogen';
import {Link, useFetcher} from 'react-router';
import {useEffect, useRef} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {FreeShippingBar} from '~/components/harpera/FreeShippingBar';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  if (layout === 'page') {
    return (
      <section aria-label="Cart page">
        <CartBuyerIdentitySync cart={originalCart} />
        <div className="mb-6 sm:mb-8">
          <h1 className="text-[24px] sm:text-[28px] font-semibold text-[rgb(18,18,18)] tracking-[0.3px]">
            Shopping Cart
          </h1>
          {cartHasItems && (
            <p className="mt-1 text-[13px] text-gray-400">
              {cart?.totalQuantity}{' '}
              {cart!.totalQuantity! === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        <CartEmpty hidden={linesCount} layout={layout} />

        {cartHasItems && (
          <>
            <FreeShippingBar subtotalAmount={cart?.cost?.subtotalAmount} />

            <div className="mt-6 lg:grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] lg:gap-8 xl:gap-12">
              {/* Items column */}
              <div>
                <div className="hidden md:grid grid-cols-[1fr_140px_100px] gap-4 pb-3 border-b border-gray-200 text-[11px] font-semibold uppercase tracking-[1.2px] text-gray-400">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                </div>
                <ul aria-label="Cart items">
                  {(cart?.lines?.nodes ?? []).map((line) => {
                    if (
                      'parentRelationship' in line &&
                      line.parentRelationship?.parent
                    ) {
                      return null;
                    }
                    return (
                      <CartLineItem
                        key={line.id}
                        line={line}
                        layout={layout}
                        childrenMap={childrenMap}
                      />
                    );
                  })}
                </ul>
              </div>

              {/* Summary column */}
              <div className="mt-8 lg:mt-0">
                <CartSummary cart={cart} layout={layout} />
              </div>
            </div>
          </>
        )}
      </section>
    );
  }

  // Aside layout
  return (
    <section
      aria-label="Cart drawer"
      className={cart?.discountCodes?.filter((c) => c.applicable).length ? 'with-discount' : ''}
    >
      <CartBuyerIdentitySync cart={originalCart} />
      {cartHasItems && (
        <FreeShippingBar subtotalAmount={cart?.cost?.subtotalAmount} />
      )}
      <CartEmpty hidden={linesCount} layout={layout} />
      <div>
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <ul aria-labelledby="cart-lines">
          {(cart?.lines?.nodes ?? []).map((line) => {
            if (
              'parentRelationship' in line &&
              line.parentRelationship?.parent
            ) {
              return null;
            }
            return (
              <CartLineItem
                key={line.id}
                line={line}
                layout={layout}
                childrenMap={childrenMap}
              />
            );
          })}
        </ul>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </section>
  );
}

function CartBuyerIdentitySync({cart}: {cart: CartApiQueryFragment | null}) {
  const fetcher = useFetcher();
  const submitted = useRef(false);
  const countryCode = cart?.buyerIdentity?.countryCode;

  useEffect(() => {
    if (submitted.current || !cart || countryCode === 'US') return;
    submitted.current = true;
    fetcher.submit(
      {
        cartFormInput: JSON.stringify({
          action: CartForm.ACTIONS.BuyerIdentityUpdate,
          inputs: {buyerIdentity: {countryCode: 'US'}},
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  }, [cart?.id, countryCode]);

  return null;
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout: CartLayout;
}) {
  const {close} = useAside();

  if (layout === 'page') {
    return (
      <div hidden={hidden} className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-gray-300 mb-6"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <h2 className="text-[20px] font-semibold text-[rgb(18,18,18)] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[14px] text-gray-400 mb-8">
          Looks like you haven&rsquo;t added anything yet.
        </p>
        <Link
          to="/collections"
          className="
            inline-flex items-center justify-center
            h-[48px] px-8
            bg-[#1e4e79] hover:bg-[#122e49]
            text-white text-[14px] font-semibold tracking-[0.5px]
            rounded-[4px] transition-colors
          "
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div hidden={hidden} className="px-5 py-6">
      <p className="text-[14px] text-gray-500 mb-4">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="
          inline-flex items-center
          text-[14px] font-medium text-[#1e4e79]
          hover:underline
        "
      >
        Continue shopping →
      </Link>
    </div>
  );
}
