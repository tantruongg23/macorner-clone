import { ProductCard } from './ProductCard';
import { TRENDING_NOW } from '~/lib/content';

export function TrendingNow() {
  return (
    <section className="py-10 md:py-14">
      <div className="container-macorner">
        <h2 className="heading-script italic text-center text-[28px] md:text-[40px] leading-tight mb-8 md:mb-10">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
          {TRENDING_NOW.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
        <div className="mt-8 md:mt-10 flex justify-center">
          <a href="#" className="btn-pill-orange">
            SHOP ALL
          </a>
        </div>
      </div>
    </section>
  );
}
