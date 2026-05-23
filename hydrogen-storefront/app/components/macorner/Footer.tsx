import {
  ChevronDownIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  TiktokIcon,
  TwitterIcon,
} from './icons';

// Column 1: top-level links + accordion triggers ("Shop By X")
const SHOP_NAV = [
  {label: 'Gift Finder', href: '#'},
  {label: 'Shop By Product', href: '#', hasChevron: true},
  {label: 'Shop By Occasion', href: '#', hasChevron: true},
  {label: 'Shop By Recipient', href: '#', hasChevron: true},
  {label: 'Shop By Hobby', href: '#', hasChevron: true},
];

const COLUMN_MACORNER = [
  {label: 'About Us', href: '#'},
  {label: 'Privacy Policy', href: '#'},
  {label: 'Accessibility Statement', href: '#'},
];

const COLUMN_HELP = [
  {label: 'Return Policy', href: '#'},
  {label: 'Help Center', href: '#'},
  {label: 'Size Chart', href: '#'},
  {label: 'Shipping And Delivery', href: '#'},
  {label: 'Cancellation & Modification Policy', href: '#'},
  {label: 'Refund & Replacement Policy', href: '#'},
  {label: 'Disclaimer Regarding Fake Websites', href: '#'},
];

// Order from live macorner.co footer: Twitter (X) → Facebook → Pinterest → Instagram → TikTok
const SOCIAL_LINKS = [
  {platform: 'X (Twitter)', icon: TwitterIcon, href: 'https://twitter.com/Macorner_Decor'},
  {platform: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/profile.php?id=100069063936706'},
  {platform: 'Pinterest', icon: PinterestIcon, href: 'https://www.pinterest.com/macorner_official'},
  {platform: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/macorner_decor'},
  {platform: 'TikTok', icon: TiktokIcon, href: 'https://www.tiktok.com/@macorner_official'},
];

// Payment provider labels rendered as plain text badges until SVG assets are downloaded.
const PAYMENT_BADGES = [
  'AMEX',
  'Apple Pay',
  'Bancontact',
  'Diners',
  'Discover',
  'Google Pay',
  'iDEAL',
  'Mastercard',
  'PayPal',
  'Shop Pay',
  'Venmo',
  'Visa',
];

export function MacornerFooter() {
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
          <form
            action="#"
            method="post"
            className="mt-6 w-full mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 max-w-[600px]"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder=""
              className="
                w-full sm:w-[410px] h-[50px]
                pl-4 pr-4
                bg-white text-[15px] text-black
                border border-[var(--color-newsletter-input-border)]
                rounded-[8px]
                outline-none focus:ring-2 focus:ring-[#FC6514]/30
              "
            />
            <button
              type="submit"
              className="
                h-[50px] px-[18px]
                bg-[var(--color-newsletter-button)] text-white
                text-[18px] md:text-[20px] font-bold tracking-wide whitespace-nowrap
                rounded-[8px]
                hover:bg-[#e85a10] transition-colors
              "
            >
              REVEAL NOW
            </button>
          </form>
        </div>
      </section>

      {/* Main footer (navy) */}
      <footer className="bg-[var(--color-footer-bg)] text-[var(--color-footer-text)] mt-[60px]">
        <div className="max-w-[1440px] mx-auto px-[15px] md:px-[50px] py-[40px] md:py-[60px]">
          <div className="flex flex-col md:flex-row md:justify-center md:gap-[80px]">
            {/* Col 1: Shop By X */}
            <div className="w-full md:w-[280px] mb-8 md:mb-0">
              <ul className="list-none m-0 p-0">
                {SHOP_NAV.map((nav) => (
                  <li key={nav.label}>
                    <a
                      href={nav.href}
                      className="
                        flex items-center justify-between gap-3
                        py-[5px]
                        text-[18px] font-normal leading-[27px] tracking-[0.6px] capitalize
                        text-white
                        border-b border-white
                        hover:text-[#FC6514] hover:border-[#FC6514]
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
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Macorner */}
            <FooterMenuColumn
              heading="Macorner"
              links={COLUMN_MACORNER}
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
                href="https://freshdesk.macorner.co/support/tickets/new"
                className="
                  inline-block text-center
                  bg-[#FC6514] text-white
                  text-[15px] font-semibold leading-[22.5px] tracking-[0.6px]
                  px-[25px] py-[10px]
                  rounded-[10px]
                  my-5
                  hover:bg-[#e85a10] transition-colors
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
                      className="block p-[11px] text-white hover:text-[#FC6514] transition-colors"
                    >
                      <Icon width={22} height={23} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment icons row — text badges until provider SVG assets are added */}
          <ul className="list-none mt-[40px] mx-[15px] md:mx-[37.5px] p-0 flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_BADGES.map((label) => (
              <li
                key={label}
                className="h-[24px] px-2 flex items-center bg-white text-[11px] font-semibold tracking-tight text-[#0b2a4a] rounded-[3px]"
              >
                {label}
              </li>
            ))}
          </ul>

          {/* Bottom terms row */}
          <div className="mt-6 text-center text-white text-[14px] font-medium tracking-[0.6px]">
            <a href="#" className="hover:text-[#FC6514] transition-colors">
              Terms Of Services
            </a>
            <span className="mx-2" aria-hidden="true">•</span>
            <a href="#" className="hover:text-[#FC6514] transition-colors">
              Privacy Policy
            </a>
            <span className="mx-2" aria-hidden="true">•</span>
            <span>MA Commerce Inc.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterMenuColumn({
  heading,
  links,
  width,
}: {
  heading: string;
  links: {label: string; href: string}[];
  width: string;
}) {
  return (
    <div className={`w-full ${width} mb-8 md:mb-0`}>
      <h2 className="text-[18px] font-medium leading-[23.4px] tracking-[0.6px] text-white m-0 mb-[15px]">
        {heading}
      </h2>
      <ul className="list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="
                inline-block
                text-[14px] font-normal leading-[25.2px] tracking-[0.6px] capitalize
                text-[rgba(255,255,255,0.75)]
                pb-[5px]
                hover:text-[#FC6514] transition-colors
              "
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
