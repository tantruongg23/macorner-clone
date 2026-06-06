import {useState, useEffect} from 'react';
import {WishlistHeart} from './WishlistHeart';
import type {WishlistItem} from '~/lib/useWishlist';

interface ImageNode {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

interface ProductGalleryProps {
  images: ImageNode[];
  selectedVariantImage?: ImageNode | null;
  wishlistProduct?: WishlistItem;
}

export function ProductGallery({
  images,
  selectedVariantImage,
  wishlistProduct,
}: ProductGalleryProps) {
  const allImages = selectedVariantImage
    ? [
        selectedVariantImage,
        ...images.filter((img) => img.id !== selectedVariantImage.id),
      ]
    : images;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (selectedVariantImage) {
      const idx = allImages.findIndex(
        (img) => img.id === selectedVariantImage.id,
      );
      if (idx !== -1) setActiveIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariantImage?.id]);

  if (!allImages.length) return null;

  const activeImage = allImages[activeIndex] ?? allImages[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-[20px] overflow-hidden bg-[#f5f5f5] cursor-zoom-in">
        <img
          src={activeImage.url}
          alt={activeImage.altText ?? ''}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="eager"
        />
        {/* Wishlist heart — top-right corner of main image */}
        {wishlistProduct && (
          <WishlistHeart
            product={wishlistProduct}
            className="absolute top-3 right-3 z-[2] w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-white/85 border-none p-0 shadow-sm hover:bg-white transition-colors"
          />
        )}
      </div>

      {/* Thumbnails — horizontal row below */}
      {allImages.length > 1 && (
        <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar">
          {allImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-[80px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? 'border-[#f36621]'
                  : 'border-[rgba(18,18,18,0.1)] hover:border-[rgba(18,18,18,0.3)]'
              }`}
            >
              <img
                src={img.url}
                alt={img.altText ?? ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
