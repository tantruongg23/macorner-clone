export interface MacornerProductCard {
  title: string;
  price: string;
  imageSrc: string;
  href: string;
  alt: string;
}

export function ProductCard({ product }: { product: MacornerProductCard }) {
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
      </div>
      <div className="px-1 flex flex-col gap-1">
        <h3 className="text-[13px] leading-[1.4] font-normal text-[rgb(18,18,18)] line-clamp-2 min-h-[36px]">
          {product.title}
        </h3>
        <p className="text-sm font-medium text-[rgb(18,18,18)]">{product.price}</p>
      </div>
    </a>
  );
}
