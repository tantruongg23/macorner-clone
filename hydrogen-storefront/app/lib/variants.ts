import type {SelectedOption} from 'storefrontapi.generated';

/**
 * Build a URL string for a product variant based on handle and selected options
 */
export function useVariantUrl(
  productHandle: string,
  selectedOptions: SelectedOption[],
): string {
  const params = new URLSearchParams();

  selectedOptions.forEach((option) => {
    params.append(option.name, option.value);
  });

  const queryString = params.toString();
  return `/products/${productHandle}${queryString ? `?${queryString}` : ''}`;
}
