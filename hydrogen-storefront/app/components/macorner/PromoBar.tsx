const PROMO_MESSAGES = [
  '🚚 Free Shipping on orders over $50',
  '🎉 Customize Your Idea — Make It Yours',
  '🎁 Perfect Gifts for Every Occasion',
  '✨ New Designs Added Every Week',
];

export function PromoBar() {
  // Render the message list twice so the track can loop seamlessly.
  const track = [...PROMO_MESSAGES, ...PROMO_MESSAGES];

  return (
    <section className="promo-marquee py-3 md:py-4 bg-gradient-to-r from-[#F36621] to-[#F7921F] overflow-hidden">
      <div
        className="promo-marquee-track flex w-max"
        role="marquee"
        aria-label={PROMO_MESSAGES.join(' — ')}
      >
        {track.map((message, index) => (
          <span
            key={index}
            aria-hidden={index >= PROMO_MESSAGES.length}
            className="flex shrink-0 items-center whitespace-nowrap px-8 text-lg md:text-2xl font-bold tracking-wide text-white"
          >
            {message}
            <span className="mx-8 opacity-60" aria-hidden="true">
              •
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
