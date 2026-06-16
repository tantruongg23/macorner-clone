import { HAPPY_CUSTOMERS_PHOTOS } from '~/lib/content';

export function HappyCustomers() {
  return (
    <section className="py-12 md:py-16 bg-[#eef4fa]">
      <div className="container-harpera">
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="heading-script italic text-[28px] md:text-[40px] leading-tight mb-2 md:mb-4">
            Happy Customers
          </h2>
          <p className="text-[rgba(18,18,18,0.7)] text-sm md:text-base mb-6">
            See what our satisfied customers are saying about their personalized gifts.
          </p>
          <a href="#" className="btn-pill-orange inline-flex">
            See More Reviews
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {HAPPY_CUSTOMERS_PHOTOS.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-[12px] overflow-hidden bg-[#f5f5f5] group cursor-pointer"
            >
              <img
                src={photo.imageSrc}
                alt={photo.alt}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
