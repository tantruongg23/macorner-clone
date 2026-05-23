import {Link} from 'react-router';
import {
  CartIcon,
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
} from './icons';

const HEADER_NAV = [
  {label: 'Graduation', href: '/collections/graduation'},
  {label: "Father's Day", href: '/pages/gifts-for-dad'},
  {label: 'Gifts', href: '#', hasDropdown: true},
  {label: 'Home & Living', href: '/collections/home-and-living'},
  {label: 'Drink & Barware', href: '/collections/drink-and-barware'},
  {label: 'Apparel', href: '/collections/apparel'},
  {label: 'Accessories', href: '/collections/accessories'},
  {label: 'Interests', href: '#', hasDropdown: true},
  {label: 'Happy Customers', href: '/pages/happy-customers'},
];

export function MacornerHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-header-border)]">
      <div
        className="
          max-w-[1440px] mx-auto
          py-5 px-[15px]
          min-[990px]:py-0 min-[990px]:pt-7 min-[990px]:px-3.5
        "
      >
        {/* Row 1 — top utility row */}
        <div
          className="
            flex items-center justify-between gap-[18px]
            min-[990px]:h-[50px]
          "
        >
          {/* Mobile hamburger (hidden on desktop) */}
          <button
            aria-label="Open menu"
            className="min-[990px]:hidden w-[18px] h-[18px] inline-flex items-center justify-center text-[var(--color-header-text)]"
          >
            <MenuIcon width={18} height={18} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            aria-label="Macorner"
            className="shrink-0 inline-flex items-center"
          >
            <img
              src="/icons/logo-macorner.svg"
              alt="Macorner"
              width={200}
              height={24}
              className="w-[151px] min-[990px]:w-[200px] h-auto block"
            />
          </Link>

          {/* Search (desktop) — rounded pill, orange search button on the RIGHT */}
          <div className="hidden min-[990px]:flex flex-1 max-w-[602px]">
            <form
              action="/search"
              method="get"
              role="search"
              className="relative w-full h-[50px]"
            >
              <input
                type="search"
                name="q"
                placeholder="Search"
                aria-label="Search"
                className="
                  w-full h-[48px] mx-px
                  pl-[15px] pr-[98px] py-[15px]
                  bg-white text-[15px] leading-[22.5px]
                  text-[rgb(18,18,18)]
                  placeholder:text-[rgb(209,214,220)]
                  outline-none
                  border border-[var(--color-header-search-border)]
                  rounded-[25px]
                  focus:border-[#FC6514]
                  transition-colors
                "
              />
              <button
                type="submit"
                aria-label="Search"
                className="
                  absolute top-1/2 -translate-y-1/2 right-[7px]
                  w-9 h-9 inline-flex items-center justify-center
                  rounded-full bg-[#FC6514] text-white
                  hover:bg-[#e85a10] transition-colors
                "
              >
                <SearchIcon width={18} height={18} />
              </button>
            </form>
          </div>

          {/* Utility cluster (desktop ≥ 990): Sign In · Wishlist · Track Order · Lang · Cart */}
          <nav
            aria-label="User menu"
            className="hidden min-[990px]:flex items-center gap-[15px] text-[var(--color-header-text)]"
          >
            <Link
              to="/account/login"
              className="text-[14px] font-medium leading-[22.5px] tracking-[0.6px] hover:text-[#FC6514] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/pages/wishlist"
              title="Wishlist"
              className="text-[15px] font-medium leading-[22.5px] tracking-[0.6px] hover:text-[#FC6514] transition-colors"
            >
              Wishlist
            </Link>
            <Link
              to="/pages/tracking-order"
              className="text-[15px] font-medium leading-[21px] tracking-[0.6px] hover:text-[#FC6514] transition-colors"
            >
              Track Order
            </Link>

            {/* Language switcher: flag | text */}
            <button
              type="button"
              aria-label="Choose region"
              className="flex items-center text-[15px] font-medium leading-[22.5px] tracking-[0.6px] text-[var(--color-brand-body)] hover:text-[#FC6514] transition-colors"
            >
              <span className="relative w-10 h-[13.3px] flex items-center">
                <img
                  src="/icons/US.svg"
                  alt="United States flag"
                  width={20}
                  height={14}
                  className="block w-5 h-[13.3px]"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-[33px] top-0 bottom-0 w-[2px] h-[13px] my-auto bg-[var(--color-pipe-separator)]"
                />
              </span>
              <span className="whitespace-nowrap">United States</span>
            </button>

            {/* Cart (desktop) */}
            <Link
              to="/cart"
              title="Cart"
              className="relative flex flex-col items-center w-[29px] h-[25.3px] text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
            >
              <CartIcon className="block w-[29px] h-[22.3px] mb-[3px]" />
              <span
                className="
                  absolute -top-1.5 -right-1.5
                  w-[19px] h-[19px] rounded-full
                  bg-[var(--color-cart-bubble)] text-white
                  text-[9px] font-medium leading-none
                  inline-flex items-center justify-center
                "
              >
                0
              </span>
            </Link>
          </nav>

          {/* Mobile right cluster: search icon · wishlist heart · cart (with smaller 15×15 bubble) */}
          <div className="min-[990px]:hidden flex items-center gap-4 text-[var(--color-header-text)]">
            <button aria-label="Search" className="w-[18px] h-[22px] inline-flex items-center justify-center">
              <SearchIcon width={18} height={19} />
            </button>
            <Link
              to="/pages/wishlist"
              title="Wishlist"
              aria-label="Wishlist"
              className="w-[23px] h-[19px] inline-flex items-center justify-center"
            >
              <HeartIcon width={22} height={19} />
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative flex items-center">
              <CartIcon className="block w-[24px] h-[18.5px]" />
              <span
                className="
                  absolute -top-1 -right-2
                  w-[15px] h-[15px] rounded-full
                  bg-[var(--color-cart-bubble)] text-white
                  text-[9px] font-medium leading-none
                  inline-flex items-center justify-center
                "
              >
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Row 2: main nav (desktop only, centered) */}
        <nav
          aria-label="Main"
          className="hidden min-[990px]:block text-center mt-[15px]"
        >
          <ul className="inline-flex flex-row list-none m-0 p-0">
            {HEADER_NAV.map((item) => (
              <li key={item.label} className="m-0 p-0">
                <a
                  href={item.href}
                  className="
                    inline-flex items-center gap-[12px]
                    px-[12px] pt-[12px] pb-[20px]
                    text-[14px] font-semibold leading-[18.2px] tracking-[0.6px]
                    text-[var(--color-header-text)]
                    hover:text-[#FC6514]
                    border-b-2 border-transparent hover:border-[#FC6514]
                    transition-colors
                  "
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDownIcon width={12} height={12} />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
