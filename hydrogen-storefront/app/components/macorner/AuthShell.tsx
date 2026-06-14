import type {ReactNode} from 'react';

export const AUTH_NAVY = '#0B2A4A';

export const authInputClass =
  'w-full h-[52px] px-[15px] rounded-[10px] bg-[#F2F4F3] border border-transparent text-[15px] text-[rgb(18,18,18)] placeholder:text-[rgba(18,18,18,0.45)] outline-none focus:border-[#FC6514] transition-colors';

export const authButtonClass =
  'w-full h-[56px] rounded-[10px] bg-[#0B2A4A] text-white text-[18px] font-medium uppercase tracking-[1px] hover:bg-[#143a63] transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

export const authLinkClass =
  'text-[14px] font-semibold tracking-[0.6px] text-[rgba(18,18,18,0.85)] hover:text-[#FC6514] underline transition-colors';

export const authTextButtonClass =
  'bg-transparent border-0 p-0 cursor-pointer text-[13px] tracking-[0.6px] text-[rgba(18,18,18,0.85)] hover:text-[#FC6514] transition-colors';

export function AuthShell({title, children}: {title: string; children: ReactNode}) {
  return (
    <div
      style={{fontFamily: 'Poppins, sans-serif'}}
      className="max-w-[448px] mx-auto px-[18px] py-16"
    >
      <h1 className="text-[22px] font-medium tracking-[0.6px] text-[#0B2A4A] text-center pb-[15px] border-b border-[var(--color-header-border)] mb-8">
        {title}
      </h1>
      {children}
    </div>
  );
}
