import {useWishlist, type WishlistItem} from '~/lib/useWishlist';

export function WishlistHeart({
  product,
  className,
}: {
  product: WishlistItem;
  className?: string;
}) {
  const {has, add, remove} = useWishlist();
  const inWishlist = has(product.handle);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      remove(product.handle);
    } else {
      add(product);
    }
  }

  return (
    <button
      type="button"
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={toggle}
      className={className}
    >
      <svg
        viewBox="0 0 290 256"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        aria-hidden="true"
        style={{
          fill: inWishlist ? '#f7921f' : 'transparent',
          stroke: '#f7921f',
          strokeWidth: 20,
          transition: 'fill 0.2s ease',
        }}
      >
        <path
          d="M258.844192 127.790368L145 241.63456 31.1558082 127.790368c-26.9461761-26.946176-26.9461761-70.6345598 0-97.5807359 26.9461762-26.94617613 70.6345598-26.94617613 97.5807358 0L145 46.4730881l16.263456-16.263456c26.946176-26.94617613 70.63456-26.94617613 97.580736 0 26.946176 26.9461761 26.946176 70.6345599 0 97.5807359z"
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
}
