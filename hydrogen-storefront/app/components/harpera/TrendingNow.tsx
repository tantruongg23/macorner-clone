import { ProductCard, type HarperaProductCard } from './ProductCard';
import { COLLECTION_KEYS } from '~/lib/constants';

export function TrendingNow({ products }: { products: HarperaProductCard[] }) {
  if (!products.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container-harpera">
        <h2 className="heading-script italic text-center text-[28px] md:text-[40px] leading-tight mb-8 md:mb-10">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
          {products.map((product) => (
            <ProductCard key={product.href} product={product} />
          ))}
        </div>
        <div className="mt-8 md:mt-10 flex justify-center">
          <a href={`/collections/${COLLECTION_KEYS.BEST_SELLING}`} className="btn-pill-orange">
            SHOP ALL
          </a>
        </div>
      </div>
    </section>
  );
}
