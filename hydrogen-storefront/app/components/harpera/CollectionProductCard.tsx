import {Link} from 'react-router';
import type {ProductNode} from '~/types/collection';
import {WishlistHeart} from './WishlistHeart';
import {JudgeMeStarBadge} from './ProductReviews';

function fmtMoney(amount: string) {
  // Always display as USD dollars since macorner.co is a USD store
  const n = parseFloat(amount);
  return `$${Number.isNaN(n) ? '0.00' : n.toFixed(2)}`;
}

function isOnSale(price: string, compare: string) {
  const p = parseFloat(price), c = parseFloat(compare);
  return !!c && c > p;
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
          <WishlistHeart
            product={{
              handle: product.handle,
              title: product.title,
              image: product.featuredImage?.url,
              price: fmtMoney(price.amount),
            }}
            className="absolute top-[8px] right-[8px] z-[2] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-white/85 border-none p-0 hover:bg-white transition-colors"
          />

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

            {/* Judge.me star badge — replaced by widget script after load */}
            <JudgeMeStarBadge productId={product.id} productHandle={product.handle} />

            <div className="card-information">
              {sale ? (
                <div className="price price--on-sale" style={{fontSize: '16px', letterSpacing: '0.6px', lineHeight: '24px'}}>
                  <span className="price-item price-item--sale price-item--last money" style={{color: 'rgba(18,18,18,0.75)'}}>
                    {fmtMoney(price.amount)}
                  </span>
                  {' '}
                  <span className="price-item price-item--regular money" style={{color: 'rgba(18,18,18,0.4)', textDecoration: 'line-through', fontSize: '14px'}}>
                    {fmtMoney(compareAt.amount)}
                  </span>
                </div>
              ) : (
                <div className="price" style={{fontSize: '16px', letterSpacing: '0.6px', lineHeight: '24px', color: soldOut ? 'rgba(18,18,18,0.4)' : 'rgba(18,18,18,0.75)'}}>
                  <span className="price-item price-item--regular money">
                    {fmtMoney(price.amount)}
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
