import type {MoneyV2} from 'storefrontapi.generated';

export function ProductPrice({price}: {price: MoneyV2 | null | undefined}) {
  if (!price) return null;

  return (
    <span className="product-price">
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currencyCode || 'USD',
      }).format(parseFloat(price.amount))}
    </span>
  );
}
