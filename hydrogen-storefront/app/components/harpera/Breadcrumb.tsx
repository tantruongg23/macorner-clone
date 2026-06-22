import {Link} from 'react-router';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({items}: {items: BreadcrumbItem[]}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="text-gray-300">/</span>}
            {item.href ? (
              <Link to={item.href} prefetch="intent" className="hover:text-[#2e6ca6] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
