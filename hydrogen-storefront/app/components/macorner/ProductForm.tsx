import {useState} from 'react';
import {Link, useSearchParams, useFetchers} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {Personalizer, parsePersonalizationFields} from './Personalizer';
import {PreviewModal} from './PreviewModal';
import {JudgeMeStarBadge} from './ProductReviews';

interface Money {
  amount: string;
  currencyCode: string;
}

interface VariantOption {
  name: string;
  value: string;
}

interface Variant {
  id: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: VariantOption[];
  image?: {
    id: string;
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
}

interface ProductOption {
  id: string;
  name: string;
  optionValues: {name: string}[];
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  options: ProductOption[];
  selectedVariant: Variant | null;
  variants: {nodes: Variant[]};
  personalizationField?: {value: string | null} | null;
}

interface ProductFormProps {
  product: Product;
  selectedVariant: Variant | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type OptionDisplayType = 'color' | 'size' | 'text';

function getOptionDisplayType(name: string): OptionDisplayType {
  const lower = name.toLowerCase();
  if (lower === 'color' || lower === 'colour') return 'color';
  if (lower === 'size') return 'size';
  return 'text';
}

function isOptionValueAvailable(
  variants: Variant[],
  optionName: string,
  value: string,
): boolean {
  return variants.some(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.some((o) => o.name === optionName && o.value === value),
  );
}


const COLOR_MAP: Record<string, string> = {
  Black: '#111111',
  White: '#f5f5f5',
  Navy: '#1e3a5f',
  'Forest Green': '#2d6a4f',
  Red: '#dc2626',
  Blue: '#2563eb',
  Green: '#16a34a',
  Gray: '#9ca3af',
  Grey: '#9ca3af',
  Pink: '#f472b6',
  Purple: '#7c3aed',
  Yellow: '#fbbf24',
  Orange: '#f97316',
  Brown: '#92400e',
  Maroon: '#7f1d1d',
  'Cardinal Red': '#9b1c1c',
  Teal: '#0d9488',
  Cream: '#fef3c7',
  Beige: '#d2b48c',
  Gold: '#d4a017',
  'Royal Blue': '#1e40af',
  'Sky Blue': '#0ea5e9',
  'Light Blue': '#7dd3fc',
  'Heather Gray': '#b0b7c3',
  'Sport Gray': '#9ca3af',
  'Sport Grey': '#8f8f8f',
  'Dark Heather': '#374151',
  Charcoal: '#4b5563',
  'Dark Navy': '#0f172a',
  Burgundy: '#7f1d1d',
  Sand: '#d4b483',
  'Military Green': '#3f5a2f',
  'Antique White': '#faebd7',
  'Vintage White': '#f5f0e8',
};

function formatMoney(money: Money) {
  // Always display as USD dollars since macorner.co is a USD store
  const amount = parseFloat(money.amount);
  return `$${amount.toFixed(2)}`;
}

function _formatMoneyWithCurrency(money: Money) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

function getDeliveryRange(): {start: string; end: string} {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  start.setDate(start.getDate() + 5);
  end.setDate(end.getDate() + 10);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  return {start: fmt(start), end: fmt(end)};
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductForm({product, selectedVariant}: ProductFormProps) {
  const [searchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [personalizationValues, setPersonalizationValues] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const {open: openAside} = useAside();

  const personalizationFields = parsePersonalizationFields(
    product.personalizationField?.value,
  );
  const fetchers = useFetchers();
  // useFetchers() only returns non-idle fetchers, so state check is unnecessary
  const isAdding = fetchers.some((f) => f.formAction === '/cart');

  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const discountPercent =
    compareAtPrice && price
      ? Math.round(
          (1 -
            parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) *
            100,
        )
      : null;

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const delivery = getDeliveryRange();

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <h1 className="text-xl md:text-[22px] font-semibold text-[rgb(18,18,18)] leading-snug">
        {product.title}
      </h1>

      {/* Stars — Judge.me replaces this badge with live rating + review count */}
      <div className="flex items-center gap-2 flex-wrap">
        <JudgeMeStarBadge productId={product.id} productHandle={product.handle} />
        <a href="#reviews" className="text-sm text-[#f36621] hover:underline sr-only">
          Reviews
        </a>
      </div>

      {/* Price */}
      {price && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl font-bold text-[#f36621]">
            {formatMoney(price)}{' '}
            <span className="text-base font-normal text-[#f36621]">USD</span>
          </span>
          {compareAtPrice &&
            parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
              <>
                <span className="text-sm text-[rgba(18,18,18,0.45)] line-through">
                  {formatMoney(compareAtPrice)} USD
                </span>
                {discountPercent && discountPercent > 0 && (
                  <span className="bg-[#f36621] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Save {discountPercent}%
                  </span>
                )}
              </>
            )}
        </div>
      )}

      {/* Delivery info */}
      <div className="flex flex-col gap-1 text-sm text-[rgb(18,18,18)]">
        <div className="flex items-center gap-2">
          <span>🇺🇸</span>
          <span>
            Deliver to{' '}
            <span className="text-[#f36621] font-medium">United States</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>🚚</span>
          <span>
            Get it by:{' '}
            <strong>
              {delivery.start} – {delivery.end}
            </strong>
          </span>
        </div>
        <div className="pl-7 text-[rgba(18,18,18,0.55)] text-xs">
          Or faster delivery with <strong>Express Shipping</strong>
        </div>
      </div>

      {/* Variant Options */}
      {product.options
        .filter((opt) => opt.optionValues.length > 1)
        .map((option) => {
          const displayType = getOptionDisplayType(option.name);
          const selectedValue = searchParams.get(option.name);

          return (
            <div key={option.id} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[rgb(18,18,18)]">
                  {option.name}
                </p>
                {displayType === 'size' && (
                  <a
                    href="#"
                    className="text-xs text-[rgba(18,18,18,0.55)] underline hover:text-[#f36621]"
                  >
                    Size Chart
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {option.optionValues.map(({name: value}) => {
                  const isSelected = selectedValue === value;
                  const available = isOptionValueAvailable(
                    product.variants.nodes,
                    option.name,
                    value,
                  );
                  const href = (() => {
                    const params = new URLSearchParams(searchParams);
                    params.set(option.name, value);
                    return `/products/${product.handle}?${params.toString()}`;
                  })();

                  if (displayType === 'color') {
                    const bgColor = COLOR_MAP[value] ?? '#d1d5db';
                    if (!available) {
                      return (
                        <span
                          key={value}
                          title={value}
                          className="w-8 h-8 rounded-full border-2 border-transparent opacity-30 cursor-not-allowed"
                          style={{backgroundColor: bgColor}}
                        />
                      );
                    }
                    return (
                      <Link
                        key={value}
                        to={href}
                        preventScrollReset
                        title={value}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-[#f36621] scale-110 shadow-sm'
                            : 'border-transparent hover:border-[rgba(18,18,18,0.3)]'
                        }`}
                        style={{backgroundColor: bgColor}}
                      />
                    );
                  }

                  if (!available) {
                    return (
                      <span
                        key={value}
                        className="px-3.5 py-1.5 rounded-full text-sm border border-[rgba(18,18,18,0.1)] text-[rgba(18,18,18,0.3)] line-through cursor-not-allowed select-none"
                      >
                        {value}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={value}
                      to={href}
                      preventScrollReset
                      className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
                        isSelected
                          ? 'border-[#f36621] text-[#f36621] font-semibold'
                          : 'border-[rgba(18,18,18,0.2)] text-[rgb(18,18,18)] hover:border-[rgba(18,18,18,0.5)]'
                      }`}
                    >
                      {value}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Personalization fields — driven by product metafield */}
      <Personalizer
        fields={personalizationFields}
        onChange={setPersonalizationValues}
      />

      {/* Quantity + CTA */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesAdd}
        inputs={{
          lines: selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                  attributes: Object.entries(personalizationValues)
                    .filter(([, v]) => v)
                    .map(([key, value]) => ({
                      // Prefix image attribute keys with _ so Shopify hides them from cart display
                      key: value.startsWith('data:') ? `_${key}` : key,
                      value,
                    })),
                },
              ]
            : [],
        }}
      >
        <div className="flex flex-col gap-3">
          {/* Quantity row */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[rgb(18,18,18)]">
              Quantity
            </span>
            <div className="flex items-center border border-[rgba(18,18,18,0.2)] rounded-full h-9 select-none">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-full flex items-center justify-center text-base text-[rgba(18,18,18,0.55)] hover:text-[rgb(18,18,18)] transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium text-[rgb(18,18,18)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-full flex items-center justify-center text-base text-[rgba(18,18,18,0.55)] hover:text-[rgb(18,18,18)] transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Preview Your Personalization */}
          {personalizationFields.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="w-full h-12 btn-pill-outline text-sm font-semibold"
            >
              Preview Your Personalization
            </button>
          )}

          {/* Add to Cart */}
          <button
            type="submit"
            disabled={!isAvailable || isAdding}
            onClick={() => {
              if (isAvailable) openAside('cart');
            }}
            className="w-full h-12 btn-pill-orange text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : isAvailable ? 'ADD TO CART' : 'SOLD OUT'}
          </button>
        </div>
      </CartForm>

      {/* Accordions */}
      <div className="flex flex-col border-t border-[rgba(18,18,18,0.08)]">
        <details className="group border-b border-[rgba(18,18,18,0.08)]">
          <summary className="flex items-center gap-3 py-4 cursor-pointer list-none">
            <span className="text-[rgba(18,18,18,0.45)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <span className="flex-1 text-sm font-medium text-[rgb(18,18,18)]">Description</span>
            <span className="text-[rgba(18,18,18,0.35)] text-lg transition-transform group-open:rotate-90">›</span>
          </summary>
          <div className="pb-4 pl-7 pr-2">
            {product.descriptionHtml ? (
              <div
                className="prose prose-sm max-w-none text-[rgba(18,18,18,0.75)] text-sm leading-relaxed"
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              />
            ) : (
              <p className="text-sm text-[rgba(18,18,18,0.6)]">{product.description}</p>
            )}
          </div>
        </details>

        <details className="group border-b border-[rgba(18,18,18,0.08)]">
          <summary className="flex items-center gap-3 py-4 cursor-pointer list-none">
            <span className="text-[rgba(18,18,18,0.45)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <span className="flex-1 text-sm font-medium text-[rgb(18,18,18)]">Shipping &amp; Returns</span>
            <span className="text-[rgba(18,18,18,0.35)] text-lg transition-transform group-open:rotate-90">›</span>
          </summary>
          <div className="pb-4 pl-7 pr-2 text-sm text-[rgba(18,18,18,0.75)] flex flex-col gap-2">
            <p>Standard shipping: <strong>5–10 business days</strong> after production.</p>
            <p>Express shipping available at checkout for faster delivery.</p>
            <p>
              Returns and replacements accepted within 30 days for quality issues.{' '}
              <a href="/policies/refund-policy" className="text-[#f36621] underline">Full policy →</a>
            </p>
          </div>
        </details>

        <details className="group">
          <summary className="flex items-center gap-3 py-4 cursor-pointer list-none">
            <span className="text-[rgba(18,18,18,0.45)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span className="flex-1 text-sm font-medium text-[rgb(18,18,18)]">Personalization</span>
            <span className="text-[rgba(18,18,18,0.35)] text-lg transition-transform group-open:rotate-90">›</span>
          </summary>
          <div className="pb-4 pl-7 pr-2 text-sm text-[rgba(18,18,18,0.75)] flex flex-col gap-2">
            <p>Fill in the personalization fields above before adding to cart.</p>
            <p>Use standard English only — no special characters or emojis.</p>
          </div>
        </details>
      </div>

      {showPreview && (
        <PreviewModal
          values={personalizationValues}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
