export interface CategoryIcon {
  label: string;
  imageSrc: string;
  href: string;
}

const TOP_CATEGORIES: CategoryIcon[] = [
  { label: "Graduation", imageSrc: "/icons/icon_graduation.webp", href: "#" },
  { label: "Father's Day", imageSrc: "/icons/icon_header_father-day.webp", href: "#" },
  { label: "USA 250th Anniversary", imageSrc: "/icons/icon_header_independence-day.webp", href: "#" },
  { label: "For Him", imageSrc: "/icons/icon_header_for-him.webp", href: "#" },
  { label: "For Her", imageSrc: "/icons/icon_header_for-her.webp", href: "#" },
  { label: "Shirt", imageSrc: "/icons/icon_shirt.png", href: "#" },
];

export function CategoryIconRow() {
  return (
    <section className="py-8 md:py-10 border-b border-[rgba(18,18,18,0.06)]">
      <div className="container-macorner">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 md:gap-8 justify-center min-w-max md:min-w-full">
            {TOP_CATEGORIES.map((category) => (
              <a
                key={category.label}
                href={category.href}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-full bg-[#f5f5f5] flex items-center justify-center overflow-hidden group-hover:bg-[#efefef] transition-colors">
                  <img
                    src={category.imageSrc}
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-center text-[12px] md:text-sm font-medium text-[rgb(18,18,18)] whitespace-nowrap group-hover:text-[#F36621] transition-colors">
                  {category.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
