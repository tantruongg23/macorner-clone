import {WishlistHeart} from './WishlistHeart';
import {JudgeMeStarBadge} from './ProductReviews';

export interface HarperaProductCard {
  title: string;
  price: string;
  imageSrc: string;
  href: string;
  alt: string;
  handle?: string;
  id?: string;
}

export function ProductCard({product}: {product: HarperaProductCard}) {
  // Derive handle from href if not explicitly provided (/products/{handle})
  const handle = product.handle ?? product.href.split('/').pop() ?? '';

  return (
    <a
      href={product.href}
      className="group flex flex-col gap-2.5 text-left transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#f5f5f5]">
        <img
          src={product.imageSrc}
          alt={product.alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Wishlist heart — top-right overlay */}
        <WishlistHeart
          product={{
            handle,
            title: product.title,
            image: product.imageSrc,
            price: product.price,
          }}
          className="absolute top-[8px] right-[8px] z-[2] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-white/85 border-none p-0 hover:bg-white transition-colors"
        />
      </div>
      <div className="px-1 flex flex-col gap-1">
        <h3 className="text-[13px] leading-[1.4] font-normal text-[rgb(18,18,18)] line-clamp-2 min-h-[36px]">
          {product.title}
        </h3>
        {/* Judge.me star badge */}
        {product.id && (
          <JudgeMeStarBadge productId={product.id} productHandle={handle} />
        )}
        <p className="text-sm font-medium text-[rgb(18,18,18)]">{product.price}</p>
      </div>
    </a>
  );
}
