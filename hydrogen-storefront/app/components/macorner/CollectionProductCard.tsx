import {Link} from 'react-router';
import type {ProductNode} from '~/types/collection';

function fmtMoney(amount: string, currency: string) {
  const n = parseFloat(amount);
  return `$${Number.isNaN(n) ? '0.00' : n.toFixed(2)} ${currency}`;
}

function isOnSale(price: string, compare: string) {
  const p = parseFloat(price), c = parseFloat(compare);
  return !!c && c > p;
}

function HeartIcon() {
  return (
    <svg
      className="icon icon-heart"
      viewBox="0 0 290 256"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      style={{fill: 'transparent', stroke: '#F16523', strokeWidth: 20, transition: 'fill 0.3s ease'}}
    >
      <path
        d="M258.844192 127.790368L145 241.63456 31.1558082 127.790368c-26.9461761-26.946176-26.9461761-70.6345598 0-97.5807359 26.9461762-26.94617613 70.6345598-26.94617613 97.5807358 0L145 46.4730881l16.263456-16.263456c26.946176-26.94617613 70.63456-26.94617613 97.580736 0 26.946176 26.9461761 26.946176 70.6345599 0 97.5807359z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function StarRating({score = 4.89, count = 0}: {score?: number; count?: number}) {
  return (
    <div
      className="jdgm-prev-badge"
      style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px'}}
    >
      <span
        className="jdgm-prev-badge__stars"
        aria-label={`${score} stars`}
        style={{display: 'flex', gap: '1px'}}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              width: '13px',
              height: '13px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' fill='%23F3912E'/%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              opacity: i <= Math.round(score) ? 1 : 0.25,
            }}
          />
        ))}
      </span>
      {count > 0 && (
        <span
          className="jdgm-prev-badge__text"
          style={{fontSize: '12px', color: 'rgba(18,18,18,0.5)', letterSpacing: '0.4px'}}
        >
          ({count})
        </span>
      )}
    </div>
  );
}

export function CollectionProductCard({product}: {product: ProductNode}) {
  const price     = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const sale      = isOnSale(price.amount, compareAt.amount);
  const soldOut   = !product.availableForSale;

  return (
    <div className="card-wrapper product-card-wrapper underline-links-hover">
      <div className="card card--standard card--media">

        {/* Square image area */}
        <div
          className="card__inner ratio"
          style={{
            position: 'relative',
            borderRadius: '20px',
            backgroundColor: 'rgb(243, 243, 243)',
            overflow: 'hidden',
            paddingBottom: '100%',
            height: 0,
          }}
        >
          <div
            className="card__media"
            style={{position: 'absolute', inset: 0, borderRadius: '20px', overflow: 'hidden'}}
          >
            <Link
              to={`/products/${product.handle}`}
              className="media media--hover-effect"
              tabIndex={-1}
              aria-hidden
              style={{display: 'block', width: '100%', height: '100%'}}
            >
              {product.featuredImage ? (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  width={product.featuredImage.width ?? 533}
                  height={product.featuredImage.height ?? 533}
                  loading="lazy"
                  className="motion-reduce"
                  style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block'}}
                  onMouseEnter={e => {(e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';}}
                  onMouseLeave={e => {(e.currentTarget as HTMLImageElement).style.transform = '';}}
                />
              ) : (
                <div style={{width: '100%', height: '100%', backgroundColor: 'rgb(243,243,243)'}} />
              )}
            </Link>
          </div>

          {/* Wishlist button — top-right */}
          <button
            type="button"
            aria-label="Add to wishlist"
            className="button-wishlist"
            data-product-handle={product.handle}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 2, padding: 0,
            }}
          >
            <HeartIcon />
          </button>

          {/* Sale badge */}
          {sale && (
            <span
              id={`Badge-${product.id}`}
              className="badge badge--bottom-left color-accent-2"
              style={{
                position: 'absolute', top: '10px', left: '10px', zIndex: 2,
                backgroundColor: 'rgb(241, 101, 35)', color: '#fff',
                fontSize: '12px', fontWeight: '500',
                padding: '2px 8px', borderRadius: '4px', lineHeight: '20px', letterSpacing: '0.4px',
              }}
            >
              Save
            </span>
          )}
          {soldOut && !sale && (
            <span
              className="badge"
              style={{
                position: 'absolute', top: '10px', left: '10px', zIndex: 2,
                backgroundColor: 'rgba(18,18,18,0.6)', color: '#fff',
                fontSize: '12px', fontWeight: '500',
                padding: '2px 8px', borderRadius: '4px', lineHeight: '20px', letterSpacing: '0.4px',
              }}
            >
              Sold out
            </span>
          )}
        </div>

        {/* Card info below image */}
        <div className="card__content" style={{paddingTop: '17px'}}>
          <div className="card__information">

            <h3
              className="card__heading h5"
              id={`title-${product.id}`}
              style={{
                fontSize: '16px', fontWeight: '400', color: 'rgb(27, 38, 49)',
                lineHeight: '26px', letterSpacing: '0.6px', margin: '0 0 6px 0',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              <Link
                to={`/products/${product.handle}`}
                id={`CardLink-${product.id}`}
                className="full-unstyled-link"
                style={{color: 'inherit', textDecoration: 'none'}}
              >
                {product.title}
              </Link>
            </h3>

            <StarRating />

            <div className="card-information">
              {sale ? (
                <div className="price price--on-sale" style={{fontSize: '16px', letterSpacing: '0.6px', lineHeight: '24px'}}>
                  <span className="price-item price-item--sale price-item--last money" style={{color: 'rgba(18,18,18,0.75)'}}>
                    {fmtMoney(price.amount, price.currencyCode)}
                  </span>
                  {' '}
                  <span className="price-item price-item--regular money" style={{color: 'rgba(18,18,18,0.4)', textDecoration: 'line-through', fontSize: '14px'}}>
                    {fmtMoney(compareAt.amount, compareAt.currencyCode)}
                  </span>
                </div>
              ) : (
                <div className="price" style={{fontSize: '16px', letterSpacing: '0.6px', lineHeight: '24px', color: soldOut ? 'rgba(18,18,18,0.4)' : 'rgba(18,18,18,0.75)'}}>
                  <span className="price-item price-item--regular money">
                    {fmtMoney(price.amount, price.currencyCode)}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
