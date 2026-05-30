export interface CategoryIconCollection {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
}

export function CategoryIconRow({ collections }: { collections?: CategoryIconCollection[] | null }) {
  const items = collections ?? [];

  if (items.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-b border-[rgba(18,18,18,0.06)]">
      <div className="container-macorner">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 md:gap-8 justify-center min-w-max md:min-w-full">
            {items.map((category) => (
              <a
                key={category.id}
                href={`/collections/${category.handle}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-full bg-[#f5f5f5] flex items-center justify-center overflow-hidden group-hover:bg-[#efefef] transition-colors">
                  {category.image && (
                    <img
                      src={category.image.url}
                      alt={category.image.altText ?? category.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <span className="text-center text-[12px] md:text-sm font-medium text-[rgb(18,18,18)] whitespace-nowrap group-hover:text-[#F36621] transition-colors">
                  {category.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
