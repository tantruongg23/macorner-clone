type SecondaryBannerData = {
  title: string;
  description: string;
  actionLink: string;
  image: {url: string; altText?: string | null | undefined} | null;
} | null;

export function SecondaryBanner({data}: {data: SecondaryBannerData}) {
  if (!data) return null;

  return (
    <section className="py-3 md:py-4">
      <div className="container-macorner">
        <div className="relative overflow-hidden rounded-[24px] bg-[#E8F4F8] grid grid-cols-1 md:grid-cols-[55%_45%] min-h-[200px] md:min-h-[320px]">
          {/* Left: image */}
          {data.image && (
            <div className="order-1 relative min-h-[180px] md:min-h-[320px]">
              <img
                src={data.image.url}
                alt={data.image.altText ?? data.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Right: text */}
          <div className="order-2 px-6 py-6 md:px-10 md:py-10 flex flex-col gap-3 md:gap-4 justify-center">
            <h2 className="heading-script italic text-[28px] md:text-[48px] leading-[1] font-medium text-[#F36621]">
              {data.title}
            </h2>
            <p className="text-[14px] md:text-[15px] max-w-[280px] text-[rgba(18,18,18,0.7)] leading-snug">
              {data.description}
            </p>
            <a href={data.actionLink} className="btn-pill-orange self-start">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
