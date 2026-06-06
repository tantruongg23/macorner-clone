import {Link} from 'react-router';

interface Category {
  title: string;
  handle: string;
  image?: {url: string; altText?: string | null} | null;
}

export function SimilarCategories({categories}: {categories: Category[]}) {
  if (categories.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-[rgba(18,18,18,0.08)]">
      <h2 className="text-lg font-semibold text-[rgb(18,18,18)] mb-6">
        Similar Categories
      </h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.handle}
            to={`/collections/${cat.handle}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-[#f7921f] hover:text-[#f7921f] text-sm font-medium transition-colors"
          >
            {cat.image?.url && (
              <img
                src={cat.image.url}
                alt={cat.image.altText ?? cat.title}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            {cat.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
