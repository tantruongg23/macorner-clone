import type { PhotoCategory } from '~/lib/content';

export interface PhotoCategoryGridProps {
  title: string;
  items: PhotoCategory[];
}

export function PhotoCategoryGrid({ title, items }: PhotoCategoryGridProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-harpera">
        <h2 className="heading-script italic text-center text-[28px] md:text-[40px] leading-tight mb-8 md:mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative overflow-hidden rounded-[20px] aspect-square"
            >
              <img
                src={item.imageSrc}
                alt={item.alt}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <h3 className="text-white font-semibold text-center px-4 text-sm md:text-base">
                  {item.label}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
