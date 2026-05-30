type HeroBannerData = {
  title: string;
  description: string;
  actionLink: string;
  image: { url: string; altText: string | null } | null;
} | null;

export function HeroBanner({ data }: { data: HeroBannerData }) {
  if (!data) return null;

  return (
    <section className="py-3 md:py-6">
      <div className="container-macorner">
        <div className="relative overflow-hidden rounded-[24px] bg-[#FFF2E7] grid grid-cols-1 md:grid-cols-[45%_55%] min-h-[280px] md:min-h-[420px]">
          {/* Left: text */}
          <div className="order-2 md:order-1 px-6 py-8 md:px-14 md:py-12 flex flex-col gap-4 md:gap-5 justify-center">
            <h1 className="heading-script italic text-[36px] md:text-[64px] leading-[1] font-medium text-[#F36621]">
              {data.title}
            </h1>
            <p className="text-[15px] md:text-base max-w-[320px] text-[rgba(18,18,18,0.7)] leading-snug">
              {data.description}
            </p>
            <div className="relative inline-flex items-center gap-3">
              <a href={data.actionLink} className="btn-pill-orange">
                Shop Now
              </a>
              <span
                aria-hidden
                className="hidden md:inline-flex absolute -left-3 -bottom-3 w-7 h-7 rounded-full bg-[#F36621] text-white text-[11px] font-semibold items-center justify-center shadow-sm"
              >
                +1
              </span>
            </div>
          </div>

          {/* Right: image */}
          {data.image && (
            <div className="order-1 md:order-2 relative min-h-[220px] md:min-h-[420px]">
              <img
                src={data.image.url}
                alt={data.image.altText ?? data.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
