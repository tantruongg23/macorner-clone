import type {PhotoCategory} from '~/lib/content';

export interface PhotoCategoryGridProps {
  title: string;
  subtitle?: string;
  items: PhotoCategory[];
  /** 'circle' (default) = fully round tiles, like macorner.co. 'square' = rounded-lg tiles. */
  imageStyle?: 'circle' | 'square';
  /**
   * Visual treatment for each card. Comes directly from the Shopify metaobject
   * `card_style` field. Supported values:
   *   'shadow'   — soft drop shadow (default)
   *   'bordered' — thin border, no shadow
   *   'flat'     — no border, no shadow
   */
  cardStyle?: string;
  /** Optional hex/css color for the section background, e.g. "#fef5ec". */
  backgroundColor?: string;
  /** Number of columns on desktop. Defaults to 4. */
  columns?: number;
}

// Faithful clone of macorner.co's "Shop By Recipient / Shop By Product" sections.
// Key visual traits from macorner:
//   - Large italic-weight orange centered heading
//   - Circular image tiles (border-radius: 50%) on a soft background
//   - Label below the circle in dark navy, medium-large weight
//   - Subtle hover scale on the circle
export function PhotoCategoryGrid({
  title,
  subtitle,
  items,
  imageStyle = 'circle',
  cardStyle,
  backgroundColor,
  columns = 4,
}: PhotoCategoryGridProps) {
  const isCircle = imageStyle === 'circle';

  // Map the metaobject card_style value to Tailwind utility classes
  const cardDecoration =
    cardStyle === 'bordered'
      ? 'border border-gray-200'
      : cardStyle === 'flat'
      ? ''
      : 'shadow-sm group-hover:shadow-md transition-shadow duration-300'; // 'shadow' is default

  // Build responsive grid class. Supports 2–6 columns. Always 2 cols on mobile.
  const colClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
  };
  const gridCols = colClass[columns] ?? colClass[4];

  return (
    <section
      className="py-10 md:py-14"
      style={backgroundColor ? {backgroundColor} : undefined}
    >
      <div className="container-harpera">
        {/* Heading — italic orange, matching macorner's section titles */}
        <h2 className="text-center italic font-bold text-[var(--color-accent)] text-[28px] md:text-[36px] leading-tight mb-2">
          {title}
        </h2>

        {subtitle && (
          <p className="text-center text-[var(--color-brand-navy)] text-sm md:text-base mb-8 md:mb-10 opacity-80">
            {subtitle}
          </p>
        )}

        {!subtitle && <div className="mb-8 md:mb-10" />}

        <ul className={`grid ${gridCols} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 list-none p-0 m-0`}>
          {items.map((item) => (
            <li key={item.label} className="text-center">
              <a href={item.href} title={item.label} className="group block">
                {/* Image container — circle by default, rounded square as fallback */}
                <div
                  className={[
                    'overflow-hidden mx-auto',
                    'aspect-square w-full max-w-[220px]',
                    isCircle ? 'rounded-full' : 'rounded-[12px]',
                    cardDecoration,
                  ].join(' ')}
                >
                  <img
                    src={item.imageSrc}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h3 className="mt-3 md:mt-4 text-[var(--color-brand-navy)] font-semibold text-[16px] md:text-[20px] leading-snug">
                  {item.label}
                </h3>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
