import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  if (layout === 'page') {
    return (
      <li className="py-5 border-b border-gray-100 last:border-b-0">
        <div className="flex gap-4 md:grid md:grid-cols-[96px_1fr_140px_100px] md:items-start">
          {/* Image */}
          {image && (
            <Link prefetch="intent" to={lineItemUrl} className="flex-shrink-0">
              <Image
                alt={title}
                aspectRatio="1/1"
                data={image}
                height={96}
                width={96}
                className="rounded-lg object-cover w-[80px] h-[80px] md:w-[96px] md:h-[96px]"
              />
            </Link>
          )}

          {/* Product info */}
          <div className="flex-1 md:flex-none min-w-0">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              className="hover:text-[#1e4e79] transition-colors"
            >
              <p className="text-[14px] font-medium text-[rgb(18,18,18)] leading-snug line-clamp-2">
                {product.title}
              </p>
            </Link>
            <ul className="mt-1 space-y-0.5">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  <small className="text-[12px] text-gray-400">
                    {option.name}: {option.value}
                  </small>
                </li>
              ))}
            </ul>
            <PersonalizationAttributes attributes={line.attributes} />
            <CartLineRemoveButton
              lineIds={[id]}
              disabled={!!line.isOptimistic}
              className="mt-2 text-[11px] text-gray-400 hover:text-red-500 transition-colors"
            />

            {/* Quantity + price on mobile (hidden on ≥md) */}
            <div className="flex items-center justify-between mt-3 md:hidden">
              <CartLineQuantity line={line} layout="page" />
              <ProductPrice
                price={line?.cost?.totalAmount}
                className="text-[14px] font-semibold text-[rgb(18,18,18)]"
              />
            </div>
          </div>

          {/* Quantity — desktop column only */}
          <div className="hidden md:flex justify-center pt-0.5">
            <CartLineQuantity line={line} layout="page" />
          </div>

          {/* Price — desktop column only */}
          <div className="hidden md:flex justify-end pt-1">
            <ProductPrice
              price={line?.cost?.totalAmount}
              className="text-[14px] font-semibold text-[rgb(18,18,18)]"
            />
          </div>
        </div>

        {/* Children (e.g. warranties, gift wrapping) */}
        {lineItemChildren && (
          <div className="mt-3 ml-[112px]">
            <p id={childrenLabelId} className="sr-only">
              Line items with {product.title}
            </p>
            <ul aria-labelledby={childrenLabelId}>
              {lineItemChildren.map((childLine) => (
                <CartLineItem
                  childrenMap={childrenMap}
                  key={childLine.id}
                  line={childLine}
                  layout={layout}
                />
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  }

  // Aside layout
  return (
    <li className="flex gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={80}
          loading="lazy"
          width={80}
          className="rounded-md object-cover w-[80px] h-[80px] flex-shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={close}
          className="hover:text-[#1e4e79] transition-colors"
        >
          <p className="text-[13px] font-medium text-[rgb(18,18,18)] leading-snug line-clamp-2">
            {product.title}
          </p>
        </Link>
        <ProductPrice
          price={line?.cost?.totalAmount}
          className="mt-0.5 text-[13px] font-semibold text-[rgb(18,18,18)]"
        />
        <ul className="mt-1 space-y-0.5">
          {selectedOptions.map((option) => (
            <li key={option.name}>
              <small className="text-[11px] text-gray-400">
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <PersonalizationAttributes attributes={line.attributes} />
        <div className="flex items-center justify-between mt-2">
          <CartLineQuantity line={line} layout="aside" />
          <CartLineRemoveButton
            lineIds={[id]}
            disabled={!!line.isOptimistic}
            className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
          />
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId}>
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartLayout;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  if (layout === 'page') {
    return (
      <div className="flex items-center border border-gray-200 rounded-[4px] overflow-hidden h-[34px]">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[16px]"
          >
            −
          </button>
        </CartLineUpdateButton>
        <span className="w-8 text-center text-[13px] font-medium text-[rgb(18,18,18)] select-none">
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            disabled={!!isOptimistic}
            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[16px]"
          >
            +
          </button>
        </CartLineUpdateButton>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 text-[12px] disabled:opacity-40"
        >
          −
        </button>
      </CartLineUpdateButton>
      <span className="w-6 text-center text-[12px] font-medium">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
          className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 text-[12px] disabled:opacity-40"
        >
          +
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
  className,
}: {
  lineIds: string[];
  disabled: boolean;
  className?: string;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className={className}
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

function isImageUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return (
    value.startsWith('https://') &&
    /\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(value)
  );
}

function PersonalizationAttributes({
  attributes,
}: {
  attributes: Array<{key: string; value?: string | null}>;
}) {
  const visible = attributes.filter((a) => !a.key.startsWith('_') && a.value);
  if (visible.length === 0) return null;

  return (
    <ul className="mt-1 flex flex-col gap-1">
      {visible.map((attr) => (
        <li key={attr.key} className="flex items-start gap-1.5">
          {isImageUrl(attr.value) ? (
            <img
              src={attr.value!}
              alt={attr.key}
              className="w-12 h-12 object-cover rounded border border-gray-100"
            />
          ) : (
            <small className="text-[11px] text-gray-500 leading-tight">
              <span className="font-medium text-gray-700">{attr.key}:</span>{' '}
              {attr.value}
            </small>
          )}
        </li>
      ))}
    </ul>
  );
}
