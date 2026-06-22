import {useState} from 'react';
import {Link, useFetcher} from 'react-router';
import type {action as newsletterAction} from '~/routes/newsletter';
import {
  ChevronDownIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  TiktokIcon,
  TwitterIcon,
} from './icons';

type FooterLink = {label: string; href: string; external?: boolean};

const SHOP_NAV = [
  {label: 'Gift Finder', href: '/pages/gift-finder'},
  {label: 'Shop By Product', href: '/collections/all', hasChevron: true},
  {label: 'Shop By Occasion', href: '/pages/shop-by-occasion', hasChevron: true},
  {label: 'Shop By Recipient', href: '/collections/gift-for-her', hasChevron: true},
  {label: 'Shop By Hobby', href: '/collections/sport', hasChevron: true},
];

const COLUMN_HARPERA: FooterLink[] = [
  {label: 'About Us', href: '/pages/about-us'},
  {label: 'Privacy Policy', href: '/pages/privacy-policy'},
  {label: 'Accessibility Statement', href: '/pages/accessibility'},
];

const COLUMN_HELP: FooterLink[] = [
  {label: 'Return Policy', href: '/pages/return-policy'},
  {label: 'Help Center', href: 'https://harpera.freshdesk.com/support/home', external: true},
  {label: 'Size Chart', href: '/pages/size-chart'},
  {label: 'Shipping And Delivery', href: '/pages/shipping-delivery'},
  {label: 'Cancellation & Modification Policy', href: '/pages/cancellation-modification-policy'},
  {label: 'Refund & Replacement Policy', href: '/pages/replacement-refund'},
  {label: 'Disclaimer Regarding Fake Websites', href: '/pages/disclaimer-regarding-fake-websites'},
];

// Order from live harpera.co footer: Twitter (X) → Facebook → Pinterest → Instagram → TikTok
const SOCIAL_LINKS = [
  {platform: 'X (Twitter)', icon: TwitterIcon, href: 'https://twitter.com/Harpera_Decor'},
  {platform: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/profile.php?id=100069063936706'},
  {platform: 'Pinterest', icon: PinterestIcon, href: 'https://www.pinterest.com/harpera_official'},
  {platform: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/harpera_decor'},
  {platform: 'TikTok', icon: TiktokIcon, href: 'https://www.tiktok.com/@harpera_official'},
];

const PAYMENT_ICONS: {label: string; slug: string}[] = [
  {label: 'American Express', slug: 'amex'},
  {label: 'Apple Pay', slug: 'apple-pay'},
  {label: 'Bancontact', slug: 'bancontact'},
  {label: 'Diners Club', slug: 'diners'},
  {label: 'Discover', slug: 'discover'},
  {label: 'Google Pay', slug: 'google-pay'},
  {label: 'iDEAL', slug: 'ideal'},
  {label: 'Mastercard', slug: 'mastercard'},
  {label: 'PayPal', slug: 'paypal'},
  {label: 'Shop Pay', slug: 'shop-pay'},
  {label: 'Venmo', slug: 'venmo'},
  {label: 'Visa', slug: 'visa'},
];

export function HarperaFooter() {
  return (
    <>
      {/* Newsletter strip — cream background */}
      <section
        aria-labelledby="newsletter-heading"
        className="bg-[var(--color-newsletter-bg)] py-[30px] pb-8"
      >
        <div className="max-w-[1440px] mx-auto px-[13px] text-center">
          <h2
            id="newsletter-heading"
            className="
              text-[22px] md:text-[30px]
              font-semibold leading-[1.3] tracking-[0.6px]
              text-[var(--color-newsletter-heading)]
              m-0
            "
          >
            Today Only: Secret privileges for you!
          </h2>
          <NewsletterForm />
        </div>
      </section>

      {/* Main footer (navy) */}
      <footer className="bg-[var(--color-footer-bg)] text-[var(--color-footer-text)] mt-[60px]">
        <div className="max-w-[1440px] mx-auto px-[15px] md:px-[50px] py-[40px] md:py-[60px]">
          <div className="flex flex-col md:flex-row md:justify-center md:gap-[80px]">
            {/* Col 1: Shop By X */}
            <FooterAccordionColumn heading="Shop By" width="md:w-[280px]">
              <ul className="list-none m-0 p-0">
                {SHOP_NAV.map((nav) => (
                  <li key={nav.label}>
                    <Link
                      to={nav.href}
                      className="
                        flex items-center justify-between gap-3
                        py-[5px]
                        text-[18px] font-normal leading-[27px] tracking-[0.6px] capitalize
                        text-white
                        border-b border-white
                        hover:text-[#1e4e79] hover:border-[#1e4e79]
                        transition-colors
                      "
                    >
                      <span>{nav.label}</span>
                      {nav.hasChevron && (
                        <ChevronDownIcon
                          width={16}
                          height={16}
                          className="shrink-0"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordionColumn>

            {/* Col 2: Harpera */}
            <FooterMenuColumn
              heading="Harpera"
              links={COLUMN_HARPERA}
              width="md:w-[177px]"
            />

            {/* Col 3: Help and Support */}
            <FooterMenuColumn
              heading="Help and Support"
              links={COLUMN_HELP}
              width="md:w-[274px]"
            />

            {/* Col 4: GET IN TOUCH */}
            <div className="w-full md:w-[276px]">
              <h2 className="text-[16px] font-semibold leading-[26px] tracking-[0.6px] text-white m-0 mb-[15px]">
                GET IN TOUCH
              </h2>
              <p className="text-[14px] font-normal leading-[20px] tracking-[0.6px] text-white m-0">
                Support Time: 9 AM to 5 PM, Mon-Sat
              </p>
              <a
                href="https://freshdesk.harpera.co/support/tickets/new"
                className="
                  inline-block text-center
                  bg-[#1e4e79] text-white
                  text-[15px] font-semibold leading-[22.5px] tracking-[0.6px]
                  px-[25px] py-[10px]
                  rounded-[10px]
                  my-5
                  hover:bg-[#122e49] transition-colors
                "
              >
                Open A Support Ticket
              </a>
              <ul className="list-none m-0 p-0 flex flex-row items-center -ml-[11px]">
                {SOCIAL_LINKS.map(({platform, icon: Icon, href}) => (
                  <li key={platform}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={platform}
                      className="block p-[11px] text-white hover:text-[#1e4e79] transition-colors"
                    >
                      <Icon width={22} height={23} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment icons row */}
          <ul className="list-none mt-[40px] mx-[15px] md:mx-[37.5px] p-0 flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_ICONS.map(({label, slug}) => (
              <li key={slug}>
                <img
                  src={`/icons/payment/${slug}.svg`}
                  alt={label}
                  width={38}
                  height={24}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>

          {/* Bottom terms row */}
          <div className="mt-6 text-center text-white text-[14px] font-medium tracking-[0.6px]">
            <Link to="/pages/terms-of-services" className="hover:text-[#1e4e79] transition-colors">
              Terms Of Services
            </Link>
            <span className="mx-2" aria-hidden="true">•</span>
            <Link to="/pages/privacy-policy" className="hover:text-[#1e4e79] transition-colors">
              Privacy Policy
            </Link>
            <span className="mx-2" aria-hidden="true">•</span>
            <span>MA Commerce Inc.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

// F.1: Newsletter form with Klaviyo useFetcher
function NewsletterForm() {
  const fetcher = useFetcher<typeof newsletterAction>();
  const data = fetcher.data;
  const isSubmitting = fetcher.state !== 'idle';

  if (data?.success) {
    return (
      <p className="mt-6 text-[#0b2a4a] font-semibold text-[18px]">
        You&apos;re subscribed!
      </p>
    );
  }

  return (
    <div className="mt-6">
      <fetcher.Form
        action="/newsletter"
        method="post"
        className="w-full mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 max-w-[600px]"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder=""
          className="
            w-full sm:w-[410px] h-[50px]
            pl-4 pr-4
            bg-white text-[15px] text-black
            border border-[var(--color-newsletter-input-border)]
            rounded-[8px]
            outline-none focus:ring-2 focus:ring-[#1e4e79]/30
          "
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            h-[50px] px-[18px]
            bg-[var(--color-newsletter-button)] text-white
            text-[18px] md:text-[20px] font-bold tracking-wide whitespace-nowrap
            rounded-[8px]
            hover:bg-[#122e49] transition-colors
            disabled:opacity-70
          "
        >
          {isSubmitting ? 'SUBSCRIBING...' : 'REVEAL NOW'}
        </button>
      </fetcher.Form>
      {data?.error && (
        <p className="mt-2 text-[#c0392b] text-[13px]">{data.error}</p>
      )}
    </div>
  );
}

// F.3: Accordion column for mobile, expanded on desktop
function FooterAccordionColumn({
  heading,
  children,
  width,
}: {
  heading: string;
  children: React.ReactNode;
  width: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full ${width}`}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between min-[990px]:cursor-default py-3 min-[990px]:py-0 border-b border-white/20 min-[990px]:border-0 mb-0 min-[990px]:mb-4"
        aria-expanded={isOpen}
      >
        <h2 className="text-[18px] font-medium leading-[23.4px] tracking-[0.6px] text-white m-0">
          {heading}
        </h2>
        <ChevronDownIcon
          width={16}
          height={16}
          className={`min-[990px]:hidden shrink-0 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-200 ${
          isOpen ? 'max-h-[600px]' : 'max-h-0 min-[990px]:max-h-[9999px]'
        } min-[990px]:max-h-[9999px] min-[990px]:overflow-visible`}
      >
        {children}
      </div>
    </div>
  );
}

function FooterMenuColumn({
  heading,
  links,
  width,
}: {
  heading: string;
  links: FooterLink[];
  width: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = `
    inline-block
    text-[14px] font-normal leading-[25.2px] tracking-[0.6px] capitalize
    text-[rgba(255,255,255,0.75)]
    pb-[5px]
    hover:text-[#1e4e79] transition-colors
  `;

  return (
    <div className={`w-full ${width}`}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between min-[990px]:cursor-default py-3 min-[990px]:py-0 border-b border-white/20 min-[990px]:border-0 mb-0 min-[990px]:mb-[15px]"
        aria-expanded={isOpen}
      >
        <h2 className="text-[18px] font-medium leading-[23.4px] tracking-[0.6px] text-white m-0">
          {heading}
        </h2>
        <ChevronDownIcon
          width={16}
          height={16}
          className={`min-[990px]:hidden shrink-0 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <ul
        className={`list-none m-0 p-0 overflow-hidden transition-[max-height] duration-200 ${
          isOpen ? 'max-h-[600px]' : 'max-h-0 min-[990px]:max-h-[9999px]'
        } min-[990px]:max-h-[9999px] min-[990px]:overflow-visible`}
      >
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className={linkClass}
              >
                {link.label}
              </a>
            ) : (
              <Link to={link.href} className={linkClass}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
