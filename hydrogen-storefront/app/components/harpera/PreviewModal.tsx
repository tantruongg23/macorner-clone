import {XIcon} from './icons';

interface PreviewModalProps {
  values: Record<string, string>;
  onClose: () => void;
}

export function PreviewModal({values, onClose}: PreviewModalProps) {
  const entries = Object.entries(values).filter(
    ([, v]) => v && !v.startsWith('data:'),
  );
  const imageEntries = Object.entries(values).filter(
    ([, v]) => v && v.startsWith('data:'),
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Personalization preview"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl w-[90vw] max-w-md p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[rgb(18,18,18)]">
            Your Personalization
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="text-[rgba(18,18,18,0.45)] hover:text-[rgb(18,18,18)] transition-colors"
          >
            <XIcon width={20} height={20} />
          </button>
        </div>

        {entries.length === 0 && imageEntries.length === 0 ? (
          <p className="text-sm text-[rgba(18,18,18,0.6)]">
            No personalization entered yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map(([key, value]) => (
              <div key={key} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-[rgba(18,18,18,0.5)] uppercase tracking-wide">
                  {key}
                </span>
                <span className="text-sm text-[rgb(18,18,18)]">{value}</span>
              </div>
            ))}
            {imageEntries.map(([key, dataUrl]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[rgba(18,18,18,0.5)] uppercase tracking-wide">
                  {key}
                </span>
                <img
                  src={dataUrl}
                  alt="Uploaded photo preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                />
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-[rgba(18,18,18,0.45)] text-center leading-relaxed">
          {/* Full Customily canvas preview is deferred to a future release. */}
          This is a summary of your entered personalization. The final product appearance may vary.
        </p>
      </div>
    </>
  );
}
