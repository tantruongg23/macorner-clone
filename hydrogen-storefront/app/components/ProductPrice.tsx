import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  className,
}: {
  price: MoneyV2 | null | undefined;
  className?: string;
}) {
  if (!price) return null;

  return (
    <span className={className ?? 'product-price'}>
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(parseFloat(price.amount))}
    </span>
  );
}
