import {useState} from 'react';
import {redirect} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import type {Route} from './+types/products.$handle';
import {PRODUCT_QUERY, RELATED_PRODUCTS_QUERY} from '~/lib/graphql/product';
import {ProductGallery} from '~/components/macorner/ProductGallery';
import {ProductForm} from '~/components/macorner/ProductForm';

export async function loader({params, request, context}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Response('Not Found', {status: 404});
  }

  const url = new URL(request.url);
  const selectedOptions = [...url.searchParams.entries()].map(
    ([name, value]) => ({name, value}),
  );

  const [{product}, relatedData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    }),
    storefront
      .query(RELATED_PRODUCTS_QUERY, {
        variables: {
          handle: 'best-selling',
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      })
      .catch(() => ({collection: null})),
  ]);

  if (!product) {
    throw new Response('Not Found', {status: 404});
  }

  const relatedProducts: Array<{
    id: string;
    title: string;
    handle: string;
    featuredImage: {url: string; altText: string | null} | null;
    priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
  }> =
    relatedData?.collection?.products?.nodes
      ?.filter((p: {id: string}) => p.id !== product.id)
      ?.slice(0, 4) ?? [];

  if (!product.selectedVariant && product.variants.nodes.length > 0) {
    const firstAvailableVariant =
      product.variants.nodes.find(
        (v: {availableForSale: boolean}) => v.availableForSale,
      ) ?? product.variants.nodes[0];
    const redirectParams = new URLSearchParams(url.searchParams);
    firstAvailableVariant.selectedOptions.forEach(
      (opt: {name: string; value: string}) => {
        redirectParams.set(opt.name, opt.value);
      },
    );
    throw redirect(`/products/${handle}?${redirectParams.toString()}`);
  }

  return {product, relatedProducts};
}

export function meta({data}: Route.MetaArgs) {
  if (!data?.product) return [{title: 'Product Not Found'}];
  return [{title: data.product.title}];
}

export default function ProductPage({loaderData}: Route.ComponentProps) {
  const {product, relatedProducts} = loaderData;
  const selectedVariant =
    product.selectedVariant ?? product.variants.nodes[0] ?? null;

  return (
    <div className="bg-white">
      <div className="container-macorner py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="md:sticky md:top-8 self-start">
            <ProductGallery
              images={product.images.nodes}
              selectedVariantImage={selectedVariant?.image}
            />
          </div>

          {/* Product info */}
          <ProductForm product={product} selectedVariant={selectedVariant} />
        </div>

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* More Items to Consider */}
        {relatedProducts.length > 0 && <MoreItems products={relatedProducts} />}
      </div>

      {selectedVariant && (
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant.price.amount,
                vendor: product.vendor,
                variantId: selectedVariant.id,
                variantTitle: selectedVariant.selectedOptions
                  .map((o: {name: string; value: string}) => o.value)
                  .join(' / '),
                quantity: 1,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

const MOCK_REVIEWS = [
  {
    id: '1',
    name: 'Janice Gomez',
    date: '05/05/2026',
    stars: 5,
    text: 'Everyone at the party loved these personalized cups. The quality feels sturdy and durable.',
    image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png',
  },
  {
    id: '2',
    name: 'Mark Gutierrez',
    date: '04/30/2026',
    stars: 5,
    text: 'The vintage photo print came out so clear and fun. The cups arrived quickly and were packed really well.',
    image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2_small.png',
  },
  {
    id: '3',
    name: 'Jean Anderson',
    date: '04/27/2026',
    stars: 5,
    text: 'Such a creative party favor idea. The personalization turned out amazing.',
    image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-3_small.png',
  },
  {
    id: '4',
    name: 'Russell Moore',
    date: '04/29/2026',
    stars: 5,
    text: 'These cups added such a fun touch to the birthday party. The print quality is surprisingly good.',
    image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-4_small.png',
  },
  {
    id: '5',
    name: 'David Webb',
    date: '04/24/2026',
    stars: 5,
    text: 'The customization looked exactly like the preview. Shipping was fast and hassle-free.',
    image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-5_small.png',
  },
];

function StarRating({count = 5}: {count?: number}) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({length: 5}).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-[#f3912e]' : 'text-[rgba(18,18,18,0.15)]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function CustomerReviews() {
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const ratingBars = [
    {stars: 5, count: 31, total: 31},
    {stars: 4, count: 0, total: 31},
    {stars: 3, count: 0, total: 31},
    {stars: 2, count: 0, total: 31},
    {stars: 1, count: 0, total: 31},
  ];

  const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

  return (
    <section
      id="reviews"
      className="mt-14 pt-10 border-t border-[rgba(18,18,18,0.08)]"
    >
      <h2 className="text-lg font-semibold text-[rgb(18,18,18)] mb-6">
        Customer Reviews
      </h2>

      {/* Rating summary — 3 columns */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6 pb-6 border-b border-[rgba(18,18,18,0.08)]">
        {/* Left: score */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="flex items-center gap-1.5">
            <StarRating count={5} />
            <span className="text-sm font-semibold text-[rgb(18,18,18)]">
              5.00 out of 5
            </span>
          </div>
          <p className="text-xs text-[rgba(18,18,18,0.55)]">
            Based on 31 reviews ✓
          </p>
        </div>

        {/* Middle: bars */}
        <div className="flex flex-col gap-1 flex-1 max-w-[220px]">
          {ratingBars.map((bar) => (
            <div key={bar.stars} className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-0.5 w-[52px] shrink-0">
                {Array.from({length: bar.stars}).map((_, i) => (
                  <svg key={i} className="w-2.5 h-2.5 text-[#f3912e]" fill="currentColor" viewBox="0 0 20 20">
                    <path d={starPath} />
                  </svg>
                ))}
              </span>
              <div className="flex-1 h-1.5 bg-[rgba(18,18,18,0.08)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2a9d5c] rounded-full"
                  style={{width: bar.total > 0 ? `${(bar.count / bar.total) * 100}%` : '0%'}}
                />
              </div>
              <span className="w-4 text-right text-[rgba(18,18,18,0.5)]">{bar.count}</span>
            </div>
          ))}
        </div>

        {/* Right: CTA */}
        <div className="md:ml-auto">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-5 py-2 rounded bg-[#2a9d5c] text-white text-sm font-medium hover:bg-[#238a50] transition-colors whitespace-nowrap"
          >
            {showForm ? 'Cancel review' : 'Write a review'}
          </button>
        </div>
      </div>

      {showForm ? (
        /* ── Write a review form ── */
        <div className="max-w-md mx-auto py-6">
          <h3 className="text-xl font-bold text-[rgb(18,18,18)] text-center mb-5">
            Write a review
          </h3>

          {/* Star rating picker */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <label className="text-sm text-[rgba(18,18,18,0.65)]">Rating</label>
            <div className="flex gap-1">
              {Array.from({length: 5}).map((_, i) => {
                const filled = i < (hoverRating || formRating);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <svg className={`w-7 h-7 ${filled ? 'text-[#f3912e]' : 'text-[rgba(18,18,18,0.15)]'} transition-colors`} fill="currentColor" viewBox="0 0 20 20">
                      <path d={starPath} />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Title */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm text-center text-[rgba(18,18,18,0.65)]">
              Review Title (100)
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="Give your review a title"
              className="w-full px-3 py-2 text-sm border border-[rgba(18,18,18,0.2)] rounded focus:outline-none focus:border-[rgba(18,18,18,0.4)] placeholder-[rgba(18,18,18,0.35)]"
            />
          </div>

          {/* Review content */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm text-center text-[rgba(18,18,18,0.65)]">
              Review content
            </label>
            <textarea
              rows={3}
              placeholder="Start writing here..."
              className="w-full px-3 py-2 text-sm border border-[rgba(18,18,18,0.2)] rounded focus:outline-none focus:border-[rgba(18,18,18,0.4)] placeholder-[rgba(18,18,18,0.35)] resize-y"
            />
          </div>

          {/* Picture/Video upload */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm text-center text-[rgba(18,18,18,0.65)]">
              Picture/Video (optional)
            </label>
            <label className="flex items-center justify-center w-24 h-24 mx-auto border border-[rgba(18,18,18,0.2)] rounded cursor-pointer hover:border-[rgba(18,18,18,0.4)] transition-colors">
              <input type="file" accept="image/*,video/*" className="hidden" />
              <svg className="w-8 h-8 text-[rgba(18,18,18,0.4)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </label>
          </div>

          {/* YouTube URL */}
          <div className="mb-4">
            <input
              type="url"
              placeholder="YouTube URL"
              className="w-full px-3 py-2 text-sm border border-[rgba(18,18,18,0.2)] rounded focus:outline-none focus:border-[rgba(18,18,18,0.4)] placeholder-[rgba(18,18,18,0.35)]"
            />
          </div>

          {/* Display name */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm text-center text-[rgba(18,18,18,0.65)]">
              Display name{' '}
              <span className="text-[rgba(18,18,18,0.45)]">
                (displayed publicly like{' '}
                <span className="text-[#2a9d5c]">John Smith</span>
                {' '}∨ )
              </span>
            </label>
            <input
              type="text"
              placeholder="Display name"
              className="w-full px-3 py-2 text-sm border border-[rgba(18,18,18,0.2)] rounded focus:outline-none focus:border-[rgba(18,18,18,0.4)] placeholder-[rgba(18,18,18,0.35)]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm text-center text-[rgba(18,18,18,0.65)]">
              Email address
            </label>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-3 py-2 text-sm border border-[rgba(18,18,18,0.2)] rounded focus:outline-none focus:border-[rgba(18,18,18,0.4)] placeholder-[rgba(18,18,18,0.35)]"
            />
          </div>

          {/* Privacy */}
          <p className="text-xs text-center text-[rgba(18,18,18,0.5)] mb-5 leading-relaxed">
            How we use your data: We&apos;ll only contact you about the review you left, and only if necessary.
            By submitting your review, you agree to Judge.me&apos;s terms, privacy and content policies.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded border border-[rgba(18,18,18,0.25)] text-sm text-[rgb(18,18,18)] hover:border-[rgba(18,18,18,0.5)] transition-colors"
            >
              Cancel review
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded bg-[#1a3a4a] text-white text-sm font-medium hover:bg-[#152f3e] transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Sort */}
          <div className="mb-4">
            <select className="text-sm text-[rgb(18,18,18)] border border-[rgba(18,18,18,0.2)] rounded px-3 py-1.5 bg-white focus:outline-none focus:border-[rgba(18,18,18,0.4)]">
              <option>Pictures First</option>
              <option>Most Recent</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>

          {/* Review cards */}
          <div className="flex flex-col divide-y divide-[rgba(18,18,18,0.08)]">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="py-5">
                <div className="flex items-center justify-between mb-2">
                  <StarRating count={review.stars} />
                  <span className="text-xs text-[rgba(18,18,18,0.45)]">{review.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[rgba(18,18,18,0.08)] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-[rgba(18,18,18,0.4)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#2a9d5c]">{review.name}</span>
                </div>
                <p className="text-sm text-[rgba(18,18,18,0.75)] leading-relaxed mb-3">
                  {review.text}
                </p>
                <div className="w-16 h-16 rounded overflow-hidden bg-[rgba(18,18,18,0.05)]">
                  <img
                    src={review.image}
                    alt={`Review by ${review.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 mt-6 text-sm">
            <span className="w-7 h-7 flex items-center justify-center rounded font-semibold text-[rgb(18,18,18)] bg-[rgba(18,18,18,0.06)]">
              1
            </span>
            {[2, 3].map((page) => (
              <button
                key={page}
                className="w-7 h-7 flex items-center justify-center rounded text-[rgba(18,18,18,0.55)] hover:bg-[rgba(18,18,18,0.06)] transition-colors"
              >
                {page}
              </button>
            ))}
            <button className="w-7 h-7 flex items-center justify-center rounded text-[rgba(18,18,18,0.55)] hover:bg-[rgba(18,18,18,0.06)] transition-colors">
              ›
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded text-[rgba(18,18,18,0.55)] hover:bg-[rgba(18,18,18,0.06)] transition-colors">
              »
            </button>
          </div>
        </>
      )}
    </section>
  );
}

interface RelatedProduct {
  id: string;
  title: string;
  handle: string;
  featuredImage: {url: string; altText: string | null} | null;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
}

function MoreItems({products}: {products: RelatedProduct[]}) {
  return (
    <section className="mt-14 pt-10 border-t border-[rgba(18,18,18,0.08)]">
      <h2 className="text-lg font-semibold text-[rgb(18,18,18)] mb-6">
        More Items to Consider
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((item) => {
          const price = `$${parseFloat(item.priceRange.minVariantPrice.amount).toFixed(2)}`;
          return (
            <a
              key={item.id}
              href={`/products/${item.handle}`}
              className="group flex flex-col gap-2.5"
            >
              <div className="aspect-square overflow-hidden rounded-[20px] bg-[#f5f5f5]">
                {item.featuredImage && (
                  <img
                    src={item.featuredImage.url}
                    alt={item.featuredImage.altText ?? item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 px-1">
                <p className="text-[13px] leading-snug text-[rgb(18,18,18)] line-clamp-2">
                  {item.title}
                </p>
                <p className="text-sm font-semibold text-[rgb(18,18,18)]">
                  {price}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
