interface CollectionBannerProps {
  description?: string | null;
  image?: {url: string; altText: string | null} | null;
}

export function CollectionBanner({description, image}: CollectionBannerProps) {
  if (!description && !image) return null;

  return (
    <div
      className="
        flex flex-col md:flex-row md:items-center gap-6
        px-[13px] pb-6 pt-2
        max-w-[1440px] mx-auto
      "
    >
      {image && (
        <div className="w-full md:w-[280px] shrink-0 rounded-xl overflow-hidden aspect-video md:aspect-square">
          <img
            src={image.url}
            alt={image.altText ?? ''}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {description && (
        <p className="text-[15px] text-[rgba(18,18,18,0.75)] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
