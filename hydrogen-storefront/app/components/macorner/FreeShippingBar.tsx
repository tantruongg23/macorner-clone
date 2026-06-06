// Free-shipping threshold in USD cents (75 USD). Verified from live macorner.co
// cart drawer; the bar is present on the live site showing "X more to free shipping".
// If the threshold changes, update FREE_SHIP_THRESHOLD_CENTS below.
const FREE_SHIP_THRESHOLD_CENTS = 7500;

interface FreeShippingBarProps {
  subtotalAmount?: {amount?: string | null; currencyCode?: string | null} | null;
}

export function FreeShippingBar({subtotalAmount}: FreeShippingBarProps) {
  const subtotalCents = Math.round(
    parseFloat(subtotalAmount?.amount ?? '0') * 100,
  );
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD_CENTS - subtotalCents);
  const progress = Math.min(100, (subtotalCents / FREE_SHIP_THRESHOLD_CENTS) * 100);
  const unlocked = remaining === 0;

  const remainingFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: subtotalAmount?.currencyCode ?? 'USD',
    minimumFractionDigits: 2,
  }).format(remaining / 100);

  return (
    <div className="px-4 py-3 bg-[#fafafa] border-b border-gray-100">
      <p className="text-center text-[12px] font-medium text-[#333] mb-2">
        {unlocked ? (
          <span className="text-[#2a9d2a]">
            You&apos;ve unlocked <strong>free shipping</strong>!
          </span>
        ) : (
          <>
            Add <strong>{remainingFormatted}</strong> more to get{' '}
            <strong>free shipping</strong>
          </>
        )}
      </p>
      <div className="w-full h-[5px] bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#f7921f] rounded-full transition-all duration-300"
          style={{width: `${progress}%`}}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Free shipping progress"
        />
      </div>
    </div>
  );
}
