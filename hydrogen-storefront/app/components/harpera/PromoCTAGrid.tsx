import type { PromoCTAItem } from '~/lib/content';

export interface PromoCTAGridProps {
  title?: string;
  items: PromoCTAItem[];
}

export function PromoCTAGrid({ title = 'Shop The Occasion', items }: PromoCTAGridProps) {
  if (!items.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container-harpera">
        <h2 className="heading-script italic text-center text-[28px] md:text-[40px] leading-tight mb-8 md:mb-10">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[20px]"
            >
              <img
                src={item.imageSrc}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 md:p-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
                </div>
                <span className="btn-pill-orange w-fit">{item.cta}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
