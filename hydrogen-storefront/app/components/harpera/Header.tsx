import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {SearchFormPredictive} from '~/components/SearchFormPredictive';
import {useAside} from '~/components/Aside';
import {useWishlist} from '~/lib/useWishlist';
import {useRecentSearches} from '~/lib/useRecentSearches';
import {HarperaSearchOverlay} from './SearchOverlay';
import {HARPERA_NAV, type NavItem} from '~/lib/staticNav';

import {
  ArrowLeftIcon,
  CartIcon,
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
} from './icons';

type CountryEntry = {name: string; code: string; currency: string};

const COUNTRIES: CountryEntry[] = [
  {name: 'Australia', code: 'AU', currency: 'AUD'},
  {name: 'Austria', code: 'AT', currency: 'EUR'},
  {name: 'Belgium', code: 'BE', currency: 'EUR'},
  {name: 'Canada', code: 'CA', currency: 'CAD'},
  {name: 'France', code: 'FR', currency: 'EUR'},
  {name: 'Germany', code: 'DE', currency: 'EUR'},
  {name: 'Italy', code: 'IT', currency: 'EUR'},
  {name: 'Netherlands', code: 'NL', currency: 'EUR'},
  {name: 'United Kingdom', code: 'GB', currency: 'GBP'},
  {name: 'United States', code: 'US', currency: 'USD'},
  {name: 'Afghanistan', code: 'AF', currency: 'AFN'},
  {name: 'Åland Islands', code: 'AX', currency: 'EUR'},
  {name: 'Albania', code: 'AL', currency: 'ALL'},
  {name: 'Algeria', code: 'DZ', currency: 'DZD'},
  {name: 'Andorra', code: 'AD', currency: 'EUR'},
  {name: 'Angola', code: 'AO', currency: 'USD'},
  {name: 'Anguilla', code: 'AI', currency: 'XCD'},
  {name: 'Antigua & Barbuda', code: 'AG', currency: 'XCD'},
  {name: 'Argentina', code: 'AR', currency: 'USD'},
  {name: 'Armenia', code: 'AM', currency: 'AMD'},
  {name: 'Aruba', code: 'AW', currency: 'AWG'},
  {name: 'Ascension Island', code: 'AC', currency: 'SHP'},
  {name: 'Azerbaijan', code: 'AZ', currency: 'AZN'},
  {name: 'Bahamas', code: 'BS', currency: 'BSD'},
  {name: 'Bahrain', code: 'BH', currency: 'USD'},
  {name: 'Bangladesh', code: 'BD', currency: 'BDT'},
  {name: 'Barbados', code: 'BB', currency: 'BBD'},
  {name: 'Belarus', code: 'BY', currency: 'USD'},
  {name: 'Belize', code: 'BZ', currency: 'BZD'},
  {name: 'Benin', code: 'BJ', currency: 'XOF'},
  {name: 'Bermuda', code: 'BM', currency: 'USD'},
  {name: 'Bhutan', code: 'BT', currency: 'USD'},
  {name: 'Bolivia', code: 'BO', currency: 'BOB'},
  {name: 'Bosnia & Herzegovina', code: 'BA', currency: 'BAM'},
  {name: 'Botswana', code: 'BW', currency: 'BWP'},
  {name: 'Brazil', code: 'BR', currency: 'USD'},
  {name: 'British Indian Ocean Territory', code: 'IO', currency: 'USD'},
  {name: 'British Virgin Islands', code: 'VG', currency: 'USD'},
  {name: 'Brunei', code: 'BN', currency: 'BND'},
  {name: 'Bulgaria', code: 'BG', currency: 'EUR'},
  {name: 'Burkina Faso', code: 'BF', currency: 'XOF'},
  {name: 'Burundi', code: 'BI', currency: 'BIF'},
  {name: 'Cambodia', code: 'KH', currency: 'KHR'},
  {name: 'Cameroon', code: 'CM', currency: 'XAF'},
  {name: 'Cape Verde', code: 'CV', currency: 'CVE'},
  {name: 'Caribbean Netherlands', code: 'BQ', currency: 'USD'},
  {name: 'Cayman Islands', code: 'KY', currency: 'KYD'},
  {name: 'Central African Republic', code: 'CF', currency: 'XAF'},
  {name: 'Chad', code: 'TD', currency: 'XAF'},
  {name: 'Chile', code: 'CL', currency: 'USD'},
  {name: 'Christmas Island', code: 'CX', currency: 'AUD'},
  {name: 'Cocos (Keeling) Islands', code: 'CC', currency: 'AUD'},
  {name: 'Colombia', code: 'CO', currency: 'USD'},
  {name: 'Comoros', code: 'KM', currency: 'KMF'},
  {name: 'Congo - Brazzaville', code: 'CG', currency: 'XAF'},
  {name: 'Congo - Kinshasa', code: 'CD', currency: 'CDF'},
  {name: 'Cook Islands', code: 'CK', currency: 'NZD'},
  {name: 'Costa Rica', code: 'CR', currency: 'CRC'},
  {name: "Côte d'Ivoire", code: 'CI', currency: 'XOF'},
  {name: 'Croatia', code: 'HR', currency: 'EUR'},
  {name: 'Curaçao', code: 'CW', currency: 'ANG'},
  {name: 'Cyprus', code: 'CY', currency: 'EUR'},
  {name: 'Czechia', code: 'CZ', currency: 'CZK'},
  {name: 'Denmark', code: 'DK', currency: 'DKK'},
  {name: 'Djibouti', code: 'DJ', currency: 'DJF'},
  {name: 'Dominica', code: 'DM', currency: 'XCD'},
  {name: 'Dominican Republic', code: 'DO', currency: 'DOP'},
  {name: 'Ecuador', code: 'EC', currency: 'USD'},
  {name: 'Egypt', code: 'EG', currency: 'EGP'},
  {name: 'El Salvador', code: 'SV', currency: 'USD'},
  {name: 'Equatorial Guinea', code: 'GQ', currency: 'XAF'},
  {name: 'Eritrea', code: 'ER', currency: 'USD'},
  {name: 'Estonia', code: 'EE', currency: 'EUR'},
  {name: 'Eswatini', code: 'SZ', currency: 'USD'},
  {name: 'Ethiopia', code: 'ET', currency: 'ETB'},
  {name: 'Falkland Islands', code: 'FK', currency: 'FKP'},
  {name: 'Faroe Islands', code: 'FO', currency: 'DKK'},
  {name: 'Fiji', code: 'FJ', currency: 'FJD'},
  {name: 'Finland', code: 'FI', currency: 'EUR'},
  {name: 'French Guiana', code: 'GF', currency: 'EUR'},
  {name: 'French Polynesia', code: 'PF', currency: 'XPF'},
  {name: 'French Southern Territories', code: 'TF', currency: 'EUR'},
  {name: 'Gabon', code: 'GA', currency: 'XOF'},
  {name: 'Gambia', code: 'GM', currency: 'GMD'},
  {name: 'Georgia', code: 'GE', currency: 'USD'},
  {name: 'Ghana', code: 'GH', currency: 'USD'},
  {name: 'Gibraltar', code: 'GI', currency: 'GBP'},
  {name: 'Greece', code: 'GR', currency: 'EUR'},
  {name: 'Greenland', code: 'GL', currency: 'DKK'},
  {name: 'Grenada', code: 'GD', currency: 'XCD'},
  {name: 'Guadeloupe', code: 'GP', currency: 'EUR'},
  {name: 'Guatemala', code: 'GT', currency: 'GTQ'},
  {name: 'Guernsey', code: 'GG', currency: 'GBP'},
  {name: 'Guinea', code: 'GN', currency: 'GNF'},
  {name: 'Guinea-Bissau', code: 'GW', currency: 'XOF'},
  {name: 'Guyana', code: 'GY', currency: 'GYD'},
  {name: 'Haiti', code: 'HT', currency: 'USD'},
  {name: 'Honduras', code: 'HN', currency: 'HNL'},
  {name: 'Hong Kong SAR', code: 'HK', currency: 'HKD'},
  {name: 'Hungary', code: 'HU', currency: 'HUF'},
  {name: 'Iceland', code: 'IS', currency: 'ISK'},
  {name: 'India', code: 'IN', currency: 'INR'},
  {name: 'Indonesia', code: 'ID', currency: 'IDR'},
  {name: 'Iraq', code: 'IQ', currency: 'USD'},
  {name: 'Ireland', code: 'IE', currency: 'EUR'},
  {name: 'Isle of Man', code: 'IM', currency: 'GBP'},
  {name: 'Israel', code: 'IL', currency: 'ILS'},
  {name: 'Jamaica', code: 'JM', currency: 'JMD'},
  {name: 'Japan', code: 'JP', currency: 'JPY'},
  {name: 'Jersey', code: 'JE', currency: 'USD'},
  {name: 'Jordan', code: 'JO', currency: 'USD'},
  {name: 'Kazakhstan', code: 'KZ', currency: 'KZT'},
  {name: 'Kenya', code: 'KE', currency: 'KES'},
  {name: 'Kiribati', code: 'KI', currency: 'USD'},
  {name: 'Kosovo', code: 'XK', currency: 'EUR'},
  {name: 'Kuwait', code: 'KW', currency: 'USD'},
  {name: 'Kyrgyzstan', code: 'KG', currency: 'KGS'},
  {name: 'Laos', code: 'LA', currency: 'LAK'},
  {name: 'Latvia', code: 'LV', currency: 'EUR'},
  {name: 'Lebanon', code: 'LB', currency: 'LBP'},
  {name: 'Lesotho', code: 'LS', currency: 'USD'},
  {name: 'Liberia', code: 'LR', currency: 'USD'},
  {name: 'Libya', code: 'LY', currency: 'USD'},
  {name: 'Liechtenstein', code: 'LI', currency: 'CHF'},
  {name: 'Lithuania', code: 'LT', currency: 'EUR'},
  {name: 'Luxembourg', code: 'LU', currency: 'EUR'},
  {name: 'Macao SAR', code: 'MO', currency: 'MOP'},
  {name: 'Madagascar', code: 'MG', currency: 'USD'},
  {name: 'Malawi', code: 'MW', currency: 'MWK'},
  {name: 'Malaysia', code: 'MY', currency: 'MYR'},
  {name: 'Maldives', code: 'MV', currency: 'MVR'},
  {name: 'Mali', code: 'ML', currency: 'XOF'},
  {name: 'Malta', code: 'MT', currency: 'EUR'},
  {name: 'Martinique', code: 'MQ', currency: 'EUR'},
  {name: 'Mauritania', code: 'MR', currency: 'USD'},
  {name: 'Mauritius', code: 'MU', currency: 'MUR'},
  {name: 'Mayotte', code: 'YT', currency: 'EUR'},
  {name: 'Mexico', code: 'MX', currency: 'USD'},
  {name: 'Moldova', code: 'MD', currency: 'MDL'},
  {name: 'Monaco', code: 'MC', currency: 'EUR'},
  {name: 'Mongolia', code: 'MN', currency: 'MNT'},
  {name: 'Montenegro', code: 'ME', currency: 'EUR'},
  {name: 'Montserrat', code: 'MS', currency: 'XCD'},
  {name: 'Morocco', code: 'MA', currency: 'MAD'},
  {name: 'Mozambique', code: 'MZ', currency: 'USD'},
  {name: 'Myanmar (Burma)', code: 'MM', currency: 'MMK'},
  {name: 'Namibia', code: 'NA', currency: 'USD'},
  {name: 'Nauru', code: 'NR', currency: 'AUD'},
  {name: 'Nepal', code: 'NP', currency: 'NPR'},
  {name: 'New Caledonia', code: 'NC', currency: 'XPF'},
  {name: 'New Zealand', code: 'NZ', currency: 'NZD'},
  {name: 'Nicaragua', code: 'NI', currency: 'NIO'},
  {name: 'Niger', code: 'NE', currency: 'XOF'},
  {name: 'Nigeria', code: 'NG', currency: 'NGN'},
  {name: 'Niue', code: 'NU', currency: 'NZD'},
  {name: 'Norfolk Island', code: 'NF', currency: 'AUD'},
  {name: 'North Macedonia', code: 'MK', currency: 'MKD'},
  {name: 'Norway', code: 'NO', currency: 'USD'},
  {name: 'Oman', code: 'OM', currency: 'USD'},
  {name: 'Pakistan', code: 'PK', currency: 'PKR'},
  {name: 'Palestinian Territories', code: 'PS', currency: 'ILS'},
  {name: 'Panama', code: 'PA', currency: 'USD'},
  {name: 'Papua New Guinea', code: 'PG', currency: 'PGK'},
  {name: 'Paraguay', code: 'PY', currency: 'PYG'},
  {name: 'Peru', code: 'PE', currency: 'PEN'},
  {name: 'Philippines', code: 'PH', currency: 'PHP'},
  {name: 'Pitcairn Islands', code: 'PN', currency: 'NZD'},
  {name: 'Poland', code: 'PL', currency: 'PLN'},
  {name: 'Portugal', code: 'PT', currency: 'EUR'},
  {name: 'Qatar', code: 'QA', currency: 'QAR'},
  {name: 'Réunion', code: 'RE', currency: 'EUR'},
  {name: 'Romania', code: 'RO', currency: 'RON'},
  {name: 'Russia', code: 'RU', currency: 'USD'},
  {name: 'Rwanda', code: 'RW', currency: 'RWF'},
  {name: 'Samoa', code: 'WS', currency: 'WST'},
  {name: 'San Marino', code: 'SM', currency: 'EUR'},
  {name: 'São Tomé & Príncipe', code: 'ST', currency: 'STD'},
  {name: 'Saudi Arabia', code: 'SA', currency: 'SAR'},
  {name: 'Senegal', code: 'SN', currency: 'XOF'},
  {name: 'Serbia', code: 'RS', currency: 'RSD'},
  {name: 'Seychelles', code: 'SC', currency: 'USD'},
  {name: 'Sierra Leone', code: 'SL', currency: 'SLL'},
  {name: 'Singapore', code: 'SG', currency: 'SGD'},
  {name: 'Sint Maarten', code: 'SX', currency: 'ANG'},
  {name: 'Slovakia', code: 'SK', currency: 'EUR'},
  {name: 'Slovenia', code: 'SI', currency: 'EUR'},
  {name: 'Solomon Islands', code: 'SB', currency: 'SBD'},
  {name: 'Somalia', code: 'SO', currency: 'USD'},
  {name: 'South Africa', code: 'ZA', currency: 'USD'},
  {name: 'South Georgia & South Sandwich Islands', code: 'GS', currency: 'GBP'},
  {name: 'South Korea', code: 'KR', currency: 'KRW'},
  {name: 'South Sudan', code: 'SS', currency: 'USD'},
  {name: 'Spain', code: 'ES', currency: 'EUR'},
  {name: 'Sri Lanka', code: 'LK', currency: 'LKR'},
  {name: 'St. Barthélemy', code: 'BL', currency: 'EUR'},
  {name: 'St. Helena', code: 'SH', currency: 'SHP'},
  {name: 'St. Kitts & Nevis', code: 'KN', currency: 'XCD'},
  {name: 'St. Lucia', code: 'LC', currency: 'XCD'},
  {name: 'St. Martin', code: 'MF', currency: 'EUR'},
  {name: 'St. Pierre & Miquelon', code: 'PM', currency: 'EUR'},
  {name: 'St. Vincent & Grenadines', code: 'VC', currency: 'XCD'},
  {name: 'Sudan', code: 'SD', currency: 'USD'},
  {name: 'Suriname', code: 'SR', currency: 'USD'},
  {name: 'Svalbard & Jan Mayen', code: 'SJ', currency: 'USD'},
  {name: 'Sweden', code: 'SE', currency: 'SEK'},
  {name: 'Switzerland', code: 'CH', currency: 'CHF'},
  {name: 'Taiwan', code: 'TW', currency: 'TWD'},
  {name: 'Tajikistan', code: 'TJ', currency: 'TJS'},
  {name: 'Tanzania', code: 'TZ', currency: 'TZS'},
  {name: 'Thailand', code: 'TH', currency: 'THB'},
  {name: 'Timor-Leste', code: 'TL', currency: 'USD'},
  {name: 'Togo', code: 'TG', currency: 'XOF'},
  {name: 'Tokelau', code: 'TK', currency: 'NZD'},
  {name: 'Tonga', code: 'TO', currency: 'TOP'},
  {name: 'Trinidad & Tobago', code: 'TT', currency: 'TTD'},
  {name: 'Tristan da Cunha', code: 'TA', currency: 'SHP'},
  {name: 'Tunisia', code: 'TN', currency: 'USD'},
  {name: 'Türkiye', code: 'TR', currency: 'USD'},
  {name: 'Turkmenistan', code: 'TM', currency: 'USD'},
  {name: 'Turks & Caicos Islands', code: 'TC', currency: 'USD'},
  {name: 'Tuvalu', code: 'TV', currency: 'AUD'},
  {name: 'U.S. Outlying Islands', code: 'UM', currency: 'USD'},
  {name: 'Uganda', code: 'UG', currency: 'UGX'},
  {name: 'Ukraine', code: 'UA', currency: 'UAH'},
  {name: 'United Arab Emirates', code: 'AE', currency: 'AED'},
  {name: 'Uruguay', code: 'UY', currency: 'UYU'},
  {name: 'Uzbekistan', code: 'UZ', currency: 'UZS'},
  {name: 'Vanuatu', code: 'VU', currency: 'VUV'},
  {name: 'Vatican City', code: 'VA', currency: 'EUR'},
  {name: 'Venezuela', code: 'VE', currency: 'USD'},
  {name: 'Wallis & Futuna', code: 'WF', currency: 'XPF'},
  {name: 'Western Sahara', code: 'EH', currency: 'MAD'},
  {name: 'Yemen', code: 'YE', currency: 'YER'},
  {name: 'Zambia', code: 'ZM', currency: 'USD'},
  {name: 'Zimbabwe', code: 'ZW', currency: 'USD'},
];

function flagEmoji(code: string): string {
  const offset = 0x1f1e6;
  const A = 65;
  return String.fromCodePoint(
    offset + code.charCodeAt(0) - A,
    offset + code.charCodeAt(1) - A,
  );
}

interface Props {
  cart?: Promise<CartApiQueryFragment | null>;
  /** Live nav from Shopify. Falls back to HARPERA_NAV when omitted/empty. */
  navItems?: NavItem[];
  customer?: Promise<{firstName: string | null} | null>;
}

export function HarperaHeader({cart, navItems, customer}: Props) {
  const navData = navItems?.length ? navItems : HARPERA_NAV;
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchFocused, setDesktopSearchFocused] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('US');
  const [pendingCode, setPendingCode] = useState('US');

  useEffect(() => {
    const saved = localStorage.getItem('harpera_region');
    if (saved && COUNTRIES.some((c) => c.code === saved)) {
      setSelectedCode(saved);
      setPendingCode(saved);
    }
  }, []);
  const {type, open: openAside} = useAside();
  const prevTypeRef = useRef<string>('closed');
  const {
    searches: recentSearches,
    save: saveSearch,
    remove: removeSearch,
    clear: clearSearches,
  } = useRecentSearches();

  useEffect(() => {
    if (prevTypeRef.current === 'mobile' && type === 'closed') {
      hamburgerRef.current?.focus();
    }
    prevTypeRef.current = type;
  }, [type]);

  function closeMobileSearch() {
    setMobileSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 relative bg-white border-b border-[var(--color-header-border)]">
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
            ref={hamburgerRef}
            aria-label="Open menu"
            onClick={() => openAside('mobile')}
            className="min-[990px]:hidden w-[18px] h-[18px] inline-flex items-center justify-center text-[var(--color-header-text)] cursor-pointer"
          >
            <MenuIcon width={18} height={18} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            aria-label="Harpera"
            className="shrink-0 inline-flex items-center"
          >
            <img
              src="/icons/logo-harpera.svg"
              alt="Harpera"
              width={200}
              height={94}
              className="w-[120px] min-[990px]:w-[160px] h-auto block"
            />
          </Link>

          {/* Search (desktop) — rounded pill with predictive dropdown */}
          <div
            ref={searchContainerRef}
            className="hidden min-[990px]:flex flex-1 max-w-[602px] relative"
          >
            <SearchFormPredictive className="w-full">
              {({inputRef, fetchResults, goToSearch}) => {
                function handleGoToSearch() {
                  const q = inputRef.current?.value?.trim() ?? '';
                  if (q) saveSearch(q);
                  goToSearch();
                }
                return (
                  <>
                    <div className="relative w-full h-[50px]">
                      <input
                        ref={inputRef}
                        name="q"
                        onChange={fetchResults}
                        onFocus={() => setDesktopSearchFocused(true)}
                        onBlur={() => setDesktopSearchFocused(false)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGoToSearch()}
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
                          focus:border-[#1e4e79]
                          transition-colors
                        "
                      />
                      <button
                        type="button"
                        onClick={handleGoToSearch}
                        aria-label="Search"
                        className="
                          absolute top-1/2 -translate-y-1/2 right-[7px]
                          w-9 h-9 inline-flex items-center justify-center
                          rounded-full bg-[#1e4e79] text-white
                          hover:bg-[#122e49] transition-colors cursor-pointer
                        "
                      >
                        <SearchIcon width={18} height={18} />
                      </button>
                    </div>
                    <HarperaSearchOverlay
                      goToSearch={handleGoToSearch}
                      inputRef={inputRef}
                      containerRef={searchContainerRef}
                      isInputFocused={desktopSearchFocused}
                      recentSearches={recentSearches}
                      onSaveSearch={saveSearch}
                      onRemoveSearch={removeSearch}
                      onClearSearches={clearSearches}
                    />
                  </>
                );
              }}
            </SearchFormPredictive>
          </div>

          {/* Utility cluster (desktop ≥ 990): Sign In · Wishlist · Track Order · Lang · Cart */}
          <nav
            aria-label="User menu"
            className="hidden min-[990px]:flex items-center gap-[15px] text-[var(--color-header-text)]"
          >
            <AccountLink customer={customer} />
            <Link
              to="/pages/wishlist"
              title="Wishlist"
              className="relative text-[15px] font-medium leading-[22.5px] tracking-[0.6px] hover:text-[#1e4e79] transition-colors"
            >
              Wishlist
              <WishlistCountBadge />
            </Link>
            <Link
              to="/pages/tracking-order"
              className="text-[15px] font-medium leading-[21px] tracking-[0.6px] hover:text-[#1e4e79] transition-colors"
            >
              Track Order
            </Link>

            {/* Language / region switcher */}
            {(() => {
              const country =
                COUNTRIES.find((c) => c.code === selectedCode) ??
                COUNTRIES[9];
              const isUS = country.code === 'US';
              return (
                <button
                  type="button"
                  aria-label="Choose region"
                  onClick={() => {
                    setPendingCode(selectedCode);
                    setLangOpen(true);
                  }}
                  className="flex items-center gap-[6px] text-[15px] font-medium leading-[22.5px] tracking-[0.6px] text-[var(--color-brand-body)] hover:text-[#1e4e79] transition-colors cursor-pointer"
                >
                  {isUS ? (
                    <span className="relative flex items-center w-10 h-[13.3px] shrink-0">
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
                  ) : (
                    <span className="text-[16px] leading-none shrink-0">
                      {flagEmoji(country.code)}
                    </span>
                  )}
                  <span className="whitespace-nowrap">{country.name}</span>
                  <ChevronDownIcon width={10} height={10} className="shrink-0 text-current" />
                </button>
              );
            })()}

            {/* Cart (desktop) */}
            <Link
              to="/cart"
              title="Cart"
              aria-label="View cart"
              className="relative flex flex-col items-center w-[29px] h-[25.3px] text-[var(--color-header-text)] hover:text-[#1e4e79] transition-colors"
            >
              <CartIcon className="block w-[29px] h-[22.3px] mb-[3px]" />
              <CartBadge cart={cart} size="desktop" />
            </Link>
          </nav>

          {/* Mobile right cluster: search icon · wishlist heart · cart */}
          <div className="min-[990px]:hidden flex items-center gap-4 text-[var(--color-header-text)]">
            <button
              aria-label="Search"
              onClick={() => setMobileSearchOpen(true)}
              className="w-[18px] h-[22px] inline-flex items-center justify-center cursor-pointer"
            >
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
            <Link
              to="/cart"
              aria-label="View cart"
              className="relative flex items-center text-[var(--color-header-text)] hover:text-[#1e4e79] transition-colors"
            >
              <CartIcon className="block w-[24px] h-[18.5px]" />
              <CartBadge cart={cart} size="mobile" />
            </Link>
          </div>
        </div>

        {/* Row 2: main nav (desktop only, centered) */}
        <nav
          aria-label="Main"
          className="hidden min-[990px]:block text-center mt-[15px]"
        >
          <ul className="inline-flex flex-row list-none m-0 p-0">
            {navData.map((item) => (
              <DesktopNavItem key={item.id} item={item} />
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <MobileSearchOverlay
          onClose={closeMobileSearch}
          recentSearches={recentSearches}
          onSaveSearch={saveSearch}
          onRemoveSearch={removeSearch}
          onClearSearches={clearSearches}
        />
      )}

      {/* Region selector modal */}
      {langOpen && (
        <RegionSelectorModal
          pendingCode={pendingCode}
          onPendingChange={setPendingCode}
          onSave={() => {
            setSelectedCode(pendingCode);
            localStorage.setItem('harpera_region', pendingCode);
            setLangOpen(false);
          }}
          onClose={() => setLangOpen(false)}
        />
      )}
    </header>
  );
}

/* ─── Desktop Nav Item with Mega Dropdown ─────────────────────────────── */

function DesktopNavItem({item}: {item: NavItem}) {
  const hasDropdown = item.groups && item.groups.length > 0;
  const groupCount = item.groups?.length ?? 0;

  /* Grid column logic matching harpera.co:
     5 or 10 groups → 5-column grid (10 = two rows stacked per column)
     9 groups        → 3-column grid (three stacked per column)
     other counts    → auto equal columns */
  const gridClass =
    groupCount === 5 || groupCount === 10
      ? 'grid-cols-5'
      : groupCount === 9
      ? 'grid-cols-3'
      : groupCount === 8
      ? 'grid-cols-8'
      : groupCount === 7
      ? 'grid-cols-7'
      : groupCount === 6
      ? 'grid-cols-6'
      : groupCount === 4
      ? 'grid-cols-4'
      : groupCount === 3
      ? 'grid-cols-3'
      : groupCount === 2
      ? 'grid-cols-2'
      : 'grid-cols-1 max-w-[240px] mx-auto';

  /* For 10 groups: pair them as top/bottom in 5 columns */
  const use10Layout = groupCount === 10;
  /* For 9 groups: stack 3 per column in 3 columns */
  const use9Layout = groupCount === 9;

  return (
    <li className="m-0 p-0 group text-static">
      <Link
        to={item.url}
        className="
          inline-flex items-center gap-[12px]
          px-[12px] pt-[12px] pb-[20px]
          text-[14px] font-semibold leading-[18.2px] tracking-[0.6px]
          text-[var(--color-header-text)]
          hover:text-[#1e4e79]
          border-b-2 border-transparent hover:border-[#1e4e79]
          transition-colors
        "
      >
        {item.title}
        {hasDropdown && <ChevronDownIcon width={12} height={12} />}
      </Link>

      {hasDropdown && (
        <div
          className="
            absolute left-0 right-0 top-full w-full bg-white
            border-b border-[var(--color-header-border)]
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            invisible opacity-0 translate-y-1
            group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-200 ease-out z-40
          "
        >
          <div className={`max-w-[1280px] mx-auto px-6 py-10 grid gap-x-8 gap-y-0 text-left ${gridClass}`}>
            {use10Layout
              ? /* 10 groups: 5 columns, consecutive pairs stacked top/bottom */
                Array.from({length: 5}).map((_, colIdx) => (
                  <div key={`col-${colIdx}`} className="flex flex-col gap-8">
                    <MegaDropdownGroup group={item.groups![colIdx * 2]} />
                    <div className="border-t border-[var(--color-header-border)] pt-6">
                      <MegaDropdownGroup group={item.groups![colIdx * 2 + 1]} />
                    </div>
                  </div>
                ))
              : use9Layout
              ? /* 9 groups: 3 columns, 3 per column stacked */
                Array.from({length: 3}).map((_, colIdx) => (
                  <div key={`col-${colIdx}`} className="flex flex-col gap-8">
                    <MegaDropdownGroup group={item.groups![colIdx * 3]} />
                    <div className="border-t border-[var(--color-header-border)] pt-6">
                      <MegaDropdownGroup group={item.groups![colIdx * 3 + 1]} />
                    </div>
                    <div className="border-t border-[var(--color-header-border)] pt-6">
                      <MegaDropdownGroup group={item.groups![colIdx * 3 + 2]} />
                    </div>
                  </div>
                ))
              : /* Default: one group per column */
                item.groups!.map((group) => (
                  <div key={group.id} className="py-2">
                    <MegaDropdownGroup group={group} />
                  </div>
                ))}
          </div>
        </div>
      )}
    </li>
  );
}

function MegaDropdownGroup({group}: {group: NonNullable<NavItem['groups']>[number]}) {
  const hasLeaves = group.items.length > 0;
  const titleClass =
    'text-[11px] font-bold tracking-[1.2px] uppercase text-[rgb(18,18,18)]';

  return (
    <div className="flex flex-col gap-3">
      {group.seeAllUrl ? (
        // Title itself links to the group's collection (matches harpera.co — no separate "See All").
        <Link
          to={group.seeAllUrl}
          className={`${titleClass} hover:text-[#1e4e79] transition-colors`}
        >
          {group.title}
        </Link>
      ) : (
        <h3 className={titleClass}>{group.title}</h3>
      )}
      {hasLeaves && (
        <ul className="flex flex-col gap-2 list-none m-0 p-0">
          {group.items.map((leaf) => (
            <li key={leaf.id} className="m-0 p-0">
              <Link
                to={leaf.url}
                className="text-[13px] font-normal leading-normal text-[#555] hover:text-[#1e4e79] transition-colors"
              >
                {leaf.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Region Selector Modal ────────────────────────────────────────────── */

function RegionSelectorModal({
  pendingCode,
  onPendingChange,
  onSave,
  onClose,
}: {
  pendingCode: string;
  onPendingChange: (code: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Update Your Preferences"
        className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-[420px] bg-white rounded-[8px] shadow-[0_8px_40px_rgba(0,0,0,0.18)] p-6"
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[17px] font-semibold text-[rgb(18,18,18)] leading-snug">
            Update Your Preferences
          </h4>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer rounded"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Country select */}
        <div className="mb-4">
          <label
            htmlFor="region-select"
            className="block text-[13px] text-gray-500 mb-1.5"
          >
            Select your shipping country
          </label>
          <select
            id="region-select"
            aria-label="Country/region"
            value={pendingCode}
            onChange={(e) => onPendingChange(e.target.value)}
            className="w-full h-[42px] border border-gray-300 rounded-[4px] px-3 text-[14px] text-[rgb(18,18,18)] bg-white focus:outline-none focus:border-[#1e4e79] transition-colors cursor-pointer"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={onSave}
          className="w-full h-[44px] bg-[#1e4e79] hover:bg-[#122e49] text-white text-[14px] font-semibold rounded-[4px] transition-colors cursor-pointer"
        >
          Save &amp; Continue
        </button>

        {/* Shipping policy link */}
        <p className="mt-3 text-center text-[12px] text-gray-400">
          Learn more about our{' '}
          <Link
            to="/pages/shipping-delivery"
            onClick={onClose}
            className="underline hover:text-[#1e4e79] transition-colors"
          >
            Shipping Policy
          </Link>
        </p>
      </div>
    </>
  );
}

function AccountLink({
  customer,
}: {
  customer?: Promise<{firstName: string | null} | null>;
}) {
  const className =
    'text-[14px] font-medium leading-[22.5px] tracking-[0.6px] hover:text-[#1e4e79] transition-colors';
  const signIn = (
    <Link to="/account/login" className={className}>
      Sign In
    </Link>
  );

  return (
    <Suspense fallback={signIn}>
      <Await resolve={customer ?? Promise.resolve(null)} errorElement={signIn}>
        {(customer) =>
          customer ? (
            <Link to="/account" className={className}>
              {customer.firstName ? `Hi, ${customer.firstName}` : 'Hi'}
            </Link>
          ) : (
            signIn
          )
        }
      </Await>
    </Suspense>
  );
}

function WishlistCountBadge() {
  const {count} = useWishlist();
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2.5 w-[17px] h-[17px] rounded-full bg-[#2e6ca6] text-white text-[9px] font-medium leading-none inline-flex items-center justify-center">
      {count}
    </span>
  );
}

function CartBadge({
  cart,
  size,
}: {
  cart?: Promise<CartApiQueryFragment | null>;
  size: 'desktop' | 'mobile';
}) {
  const baseClass =
    size === 'desktop'
      ? 'absolute -top-1.5 -right-1.5 w-[19px] h-[19px]'
      : 'absolute -top-1 -right-2 w-[15px] h-[15px]';

  return (
    <Suspense fallback={null}>
      <Await resolve={cart ?? Promise.resolve(null)}>
        {(cartData) => {
          const count = cartData?.totalQuantity ?? 0;
          if (count === 0) return null;
          return (
            <span
              className={`
                ${baseClass}
                rounded-full bg-[var(--color-cart-bubble)] text-white
                text-[9px] font-medium leading-none
                inline-flex items-center justify-center
              `}
            >
              {count}
            </span>
          );
        }}
      </Await>
    </Suspense>
  );
}

function MobileSearchOverlay({
  onClose,
  recentSearches,
  onSaveSearch,
  onRemoveSearch,
  onClearSearches,
}: {
  onClose: () => void;
  recentSearches: string[];
  onSaveSearch: (term: string) => void;
  onRemoveSearch: (term: string) => void;
  onClearSearches: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search panel — fixed, full width, sits above backdrop */}
      <div
        ref={panelRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md relative"
      >
        <SearchFormPredictive className="w-full">
          {({inputRef, fetchResults, goToSearch}) => {
            function handleGoToSearch() {
              const q = inputRef.current?.value?.trim() ?? '';
              if (q) onSaveSearch(q);
              goToSearch();
              onClose();
            }
            return (
              <>
                <div className="flex items-center gap-3 px-4 h-[60px]">
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={onClose}
                    className="shrink-0 text-[var(--color-header-text)] hover:text-[#1e4e79] transition-colors cursor-pointer"
                  >
                    <ArrowLeftIcon width={20} height={20} />
                  </button>
                  <input
                    ref={inputRef}
                    name="q"
                    autoFocus
                    onChange={fetchResults}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGoToSearch();
                      if (e.key === 'Escape') onClose();
                    }}
                    placeholder="Search products..."
                    aria-label="Search"
                    className="
                      flex-1 h-[40px]
                      px-[14px]
                      bg-[#f5f5f5]
                      text-[15px]
                      text-[rgb(18,18,18)]
                      placeholder:text-[rgb(180,185,192)]
                      outline-none
                      border border-transparent
                      rounded-[20px]
                      focus:border-[#1e4e79] focus:bg-white
                      transition-colors
                    "
                  />
                  <button
                    type="button"
                    onClick={handleGoToSearch}
                    aria-label="Search"
                    className="
                      shrink-0 w-9 h-9
                      inline-flex items-center justify-center
                      rounded-full bg-[#1e4e79] text-white
                      hover:bg-[#122e49] transition-colors cursor-pointer
                    "
                  >
                    <SearchIcon width={16} height={16} />
                  </button>
                </div>
                <HarperaSearchOverlay
                  goToSearch={handleGoToSearch}
                  inputRef={inputRef}
                  containerRef={panelRef}
                  isInputFocused={true}
                  recentSearches={recentSearches}
                  onSaveSearch={onSaveSearch}
                  onRemoveSearch={onRemoveSearch}
                  onClearSearches={onClearSearches}
                />
              </>
            );
          }}
        </SearchFormPredictive>
      </div>
    </>
  );
}
