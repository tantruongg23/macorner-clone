import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef} from 'react';
import {Link, useFetcher} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const discountCodeInputId = useId();
  const giftCardInputId = useId();

  if (layout === 'page') {
    return (
      <div
        aria-labelledby={summaryId}
        className="bg-[#fafafa] rounded-xl border border-gray-100 p-6 lg:sticky lg:top-[90px]"
      >
        <h2
          id={summaryId}
          className="text-[15px] font-semibold tracking-[0.5px] uppercase text-[rgb(18,18,18)] mb-5 pb-4 border-b border-gray-200"
        >
          Order Summary
        </h2>

        <dl className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <dt className="text-[14px] text-gray-500">Subtotal</dt>
            <dd className="text-[14px] font-semibold text-[rgb(18,18,18)]">
              {cart?.cost?.subtotalAmount?.amount ? (
                <Money data={{...cart.cost.subtotalAmount, currencyCode: 'USD' as const}} />
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[13px] text-gray-400">Shipping</dt>
            <dd className="text-[13px] text-gray-400">
              Calculated at checkout
            </dd>
          </div>
        </dl>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[rgb(18,18,18)]">
              Estimated Total
            </span>
            <span className="text-[15px] font-semibold text-[rgb(18,18,18)]">
              {cart?.cost?.subtotalAmount?.amount ? (
                <Money data={{...cart.cost.subtotalAmount, currencyCode: 'USD' as const}} />
              ) : (
                '—'
              )}
            </span>
          </div>
        </div>

        <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout="page" />

        <Link
          to="/collections"
          className="block text-center text-[13px] text-gray-400 hover:text-[#FC6514] transition-colors mt-3"
        >
          ← Continue Shopping
        </Link>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <CartDiscounts
            discountCodes={cart?.discountCodes}
            discountCodeInputId={discountCodeInputId}
          />
        </div>

        <CartGiftCard
          giftCardCodes={cart?.appliedGiftCards}
          giftCardInputId={giftCardInputId}
        />
      </div>
    );
  }

  // Aside layout
  return (
    <div className="px-5 py-4 border-t border-gray-100" aria-labelledby={summaryId}>
      <h4 id={summaryId} className="sr-only">
        Totals
      </h4>
      <dl className="flex items-center justify-between mb-4">
        <dt className="text-[14px] font-medium text-gray-600">Subtotal</dt>
        <dd className="text-[14px] font-semibold text-[rgb(18,18,18)]">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={{...cart.cost.subtotalAmount, currencyCode: 'USD' as const}} />
          ) : (
            '—'
          )}
        </dd>
      </dl>

      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountCodeInputId={discountCodeInputId}
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardInputId={giftCardInputId}
      />

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout="aside" />

      <Link
        to="/cart"
        className="
          block w-full h-[44px] mt-2
          flex items-center justify-center
          border border-[#0b2a4a] text-[#0b2a4a]
          text-[13px] font-semibold tracking-[0.5px] rounded-[4px]
          hover:bg-[#0b2a4a] hover:text-white transition-colors
        "
      >
        View Cart
      </Link>
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  layout,
}: {
  checkoutUrl?: string;
  layout: CartLayout;
}) {
  if (!checkoutUrl) return null;

  if (layout === 'page') {
    return (
      <a
        href={checkoutUrl}
        target="_self"
        className="
          block w-full h-[50px]
          flex items-center justify-center
          bg-[#0b2a4a] hover:bg-[#1a3a5c]
          text-white text-[14px] font-semibold tracking-[0.6px]
          rounded-[4px] transition-colors
        "
      >
        Checkout →
      </a>
    );
  }

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="
        block w-full h-[48px]
        flex items-center justify-center
        bg-[#FC6514] hover:bg-[#e85a10]
        text-white text-[13px] font-semibold tracking-[0.5px]
        rounded-[4px] transition-colors
      "
    >
      Continue to Checkout →
    </a>
  );
}

function CartDiscounts({
  discountCodes,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mb-3">
      {codes.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-green-600 font-medium">
            Discount: {codes.join(', ')}
          </span>
          <UpdateDiscountForm>
            <button
              type="submit"
              className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </UpdateDiscountForm>
        </div>
      )}

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <label htmlFor={discountCodeInputId} className="sr-only">
            Discount code
          </label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="
              flex-1 h-[38px] px-3
              border border-gray-200 rounded-[4px]
              text-[13px] text-[rgb(18,18,18)]
              placeholder:text-gray-300
              outline-none focus:border-[#FC6514]
              transition-colors
            "
          />
          <button
            type="submit"
            className="
              h-[38px] px-4
              border border-gray-300 rounded-[4px]
              text-[12px] font-medium text-gray-600
              hover:border-[#FC6514] hover:text-[#FC6514]
              transition-colors whitespace-nowrap
            "
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div className="mt-3">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="mb-2">
          {giftCardCodes.map((giftCard) => (
            <div
              key={giftCard.id}
              className="flex items-center justify-between mb-1"
            >
              <span className="text-[13px] text-green-600">
                Gift card: ***{giftCard.lastCharacters}{' '}
                <Money data={{...giftCard.amountUsed, currencyCode: 'USD' as const}} />
              </span>
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.GiftCardCodesRemove}
                inputs={{giftCardCodes: [giftCard.id]}}
              >
                <button
                  type="submit"
                  aria-label={`Remove gift card ending in ${giftCard.lastCharacters}`}
                  className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </CartForm>
            </div>
          ))}
        </div>
      )}

      <CartForm
        fetcherKey="gift-card-add"
        route="/cart"
        action={CartForm.ACTIONS.GiftCardCodesAdd}
      >
        <div className="flex gap-2">
          <label htmlFor={giftCardInputId} className="sr-only">
            Gift card code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="
              flex-1 h-[38px] px-3
              border border-gray-200 rounded-[4px]
              text-[13px] text-[rgb(18,18,18)]
              placeholder:text-gray-300
              outline-none focus:border-[#FC6514]
              transition-colors
            "
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="
              h-[38px] px-4
              border border-gray-300 rounded-[4px]
              text-[12px] font-medium text-gray-600
              hover:border-[#FC6514] hover:text-[#FC6514]
              disabled:opacity-50
              transition-colors whitespace-nowrap
            "
          >
            Apply
          </button>
        </div>
      </CartForm>
    </div>
  );
}
