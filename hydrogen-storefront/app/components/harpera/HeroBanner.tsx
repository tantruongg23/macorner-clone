import {useCallback, useEffect, useState, type ReactNode} from 'react';
import {Link} from 'react-router';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {ChevronLeftIcon, ChevronRightIcon} from './icons';

export type HeroBannerData = {
  title: string;
  description: string;
  actionLink: string;
  actionLabel?: string;
  image: {url: string; altText?: string | null | undefined} | null;
};

export function HeroBanner({slides}: {slides: HeroBannerData[]}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true}, [
    Autoplay({delay: 4500, stopOnInteraction: false}),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const handleMouseEnter = useCallback(() => {
    (emblaApi?.plugins() as {autoplay?: {stop: () => void}})?.autoplay?.stop();
  }, [emblaApi]);

  const handleMouseLeave = useCallback(() => {
    (emblaApi?.plugins() as {autoplay?: {play: () => void}})?.autoplay?.play();
  }, [emblaApi]);

  if (!slides || slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <section className="py-3 md:py-6">
        <div className="container-harpera">
          <SlideContent data={slides[0]} />
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-3 md:py-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container-harpera">
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden rounded-[24px]">
            <div className="flex">
              {slides.map((slide, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0">
                  <SlideContent data={slide} />
                </div>
              ))}
            </div>
          </div>

          {/* Prev button */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#121212] hover:text-[#1e4e79] transition-colors cursor-pointer z-10"
          >
            <ChevronLeftIcon width={20} height={20} />
          </button>

          {/* Next button */}
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#121212] hover:text-[#1e4e79] transition-colors cursor-pointer z-10"
          >
            <ChevronRightIcon width={20} height={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                  i === selectedIndex
                    ? 'bg-[#1e4e79]'
                    : 'border-2 border-[#1e4e79] bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionLink({href, className, children}: {href: string; className?: string; children: ReactNode}) {
  const isInternal = href.startsWith('/');
  if (isInternal) return <Link to={href} prefetch="intent" className={className}>{children}</Link>;
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function SlideContent({data}: {data: HeroBannerData}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#eaf1f8] grid grid-cols-1 md:grid-cols-[45%_55%] min-h-[280px] md:min-h-[420px]">
      {/* Left: text */}
      <div className="order-2 md:order-1 px-6 py-8 md:px-14 md:py-12 flex flex-col gap-4 md:gap-5 justify-center">
        <h1 className="heading-script italic text-[36px] md:text-[64px] leading-[1] font-medium text-[#163c5e]">
          {data.title}
        </h1>
        <p className="text-[15px] md:text-base max-w-[320px] text-[rgba(18,18,18,0.7)] leading-snug">
          {data.description}
        </p>
        <div className="relative inline-flex items-center gap-3">
          <ActionLink href={data.actionLink} className="btn-pill-orange">
            {data.actionLabel ?? 'Shop Now'}
          </ActionLink>
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
  );
}
