import {Link} from 'react-router';

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
      <div className="container-harpera">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-5 md:gap-8 justify-center min-w-max md:min-w-full">
            {items.map((category) => (
              <Link
                key={category.id}
                to={`/collections/${category.handle}`}
                prefetch="intent"
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-[91px] h-[91px] md:w-[150px] md:h-[150px] rounded-full bg-[#f5f5f5] flex items-center justify-center overflow-hidden group-hover:bg-[#efefef] transition-colors">
                  {category.image && (
                    <img
                      src={category.image.url}
                      alt={category.image.altText ?? category.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <span className="text-center text-[13px] md:text-base font-medium text-[rgb(18,18,18)] whitespace-nowrap group-hover:text-[#163c5e] transition-colors">
                  {category.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
