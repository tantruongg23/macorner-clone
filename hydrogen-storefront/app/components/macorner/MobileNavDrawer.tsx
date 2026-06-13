import {Link, NavLink} from 'react-router';
import {useAside} from '~/components/Aside';
import {useEffect, useRef, useState} from 'react';
import {MACORNER_NAV, type NavItem, type NavGroup} from '~/lib/staticNav';

import {ChevronDownIcon, XIcon} from './icons';

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type PanelLevel =
  | {level: 0}
  | {level: 1; item: NavItem}
  | {level: 2; item: NavItem; group: NavGroup};

interface MobileNavDrawerProps {
  /** Live nav from Shopify. Falls back to MACORNER_NAV when omitted/empty. */
  navItems?: NavItem[];
}

export function MobileNavDrawer({navItems}: MobileNavDrawerProps) {
  const navData = navItems?.length ? navItems : MACORNER_NAV;
  const {type, close} = useAside();
  const isOpen = type === 'mobile';
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [panel, setPanel] = useState<PanelLevel>({level: 0});

  /* Reset panel on open */
  useEffect(() => {
    if (isOpen) setPanel({level: 0});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (panel.level > 0) {
          goBack();
          return;
        }
        close();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close, panel]);

  function goBack() {
    setPanel((prev) => {
      if (prev.level === 2) return {level: 1 as const, item: prev.item};
      return {level: 0 as const};
    });
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-white z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100 shrink-0">
          {panel.level > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[1.2px] text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors cursor-pointer"
            >
              <ChevronDownIcon
                width={14}
                height={14}
                className="rotate-90 shrink-0"
              />
              {panel.level === 1 ? 'Menu' : (panel.level === 2 ? panel.item.title : 'Menu')}
            </button>
          ) : (
            <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--color-header-text)]">
              Menu
            </span>
          )}
          <button
            ref={closeButtonRef}
            onClick={close}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors cursor-pointer"
          >
            <XIcon width={20} height={20} />
          </button>
        </div>

        {/* Panel content — slides via translateX */}
        <div className="flex-1 overflow-hidden relative">
          {/* Level 0: top-level items */}
          <div
            className={`absolute inset-0 transition-transform duration-250 ease-out overflow-y-auto ${
              panel.level === 0 ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col px-5 py-2">
                {navData.map((item) =>
                  item.groups && item.groups.length > 0 ? (
                    <li key={item.id} className="border-b border-gray-50">
                      <button
                        type="button"
                        onClick={() => setPanel({level: 1, item})}
                        className="w-full flex items-center justify-between py-3.5 text-[14px] font-semibold text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
                        aria-haspopup="true"
                      >
                        <span>{item.title}</span>
                        <ChevronDownIcon
                          width={14}
                          height={14}
                          className="-rotate-90 shrink-0"
                        />
                      </button>
                    </li>
                  ) : (
                    <li key={item.id} className="border-b border-gray-50">
                      <NavLink
                        to={item.url}
                        onClick={close}
                        className={({isActive}) =>
                          `block py-3.5 text-[14px] font-semibold transition-colors ${
                            isActive
                              ? 'text-[#FC6514]'
                              : 'text-[var(--color-header-text)] hover:text-[#FC6514]'
                          }`
                        }
                      >
                        {item.title}
                      </NavLink>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* Utility links */}
            <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
              <Link
                to="/account/login"
                onClick={close}
                className="text-[14px] font-medium text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/pages/wishlist"
                onClick={close}
                className="text-[14px] font-medium text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
              >
                Wishlist
              </Link>
              <Link
                to="/pages/tracking-order"
                onClick={close}
                className="text-[14px] font-medium text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
              >
                Track Order
              </Link>
            </div>
          </div>

          {/* Level 1: groups of the selected top-level item */}
          <div
            className={`absolute inset-0 transition-transform duration-250 ease-out overflow-y-auto ${
              panel.level === 1 ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {panel.level === 1 && (
              <nav aria-label={`${panel.item.title} submenu`}>
                {/* "See All" for this top-level item */}
                <div className="px-5 pt-4 pb-2">
                  <Link
                    to={panel.item.url}
                    onClick={close}
                    className="text-[13px] font-semibold text-[#FC6514] hover:underline"
                  >
                    See All {panel.item.title}
                  </Link>
                </div>
                <ul className="flex flex-col px-5 pb-6">
                  {panel.item.groups!.map((group) =>
                    group.items.length > 0 ? (
                      <li key={group.id} className="border-b border-gray-50">
                        <button
                          type="button"
                          onClick={() =>
                            setPanel({level: 2, item: panel.item, group})
                          }
                          className="w-full flex items-center justify-between py-3.5 text-[14px] font-semibold text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
                          aria-haspopup="true"
                        >
                          <span>{group.title}</span>
                          <ChevronDownIcon
                            width={14}
                            height={14}
                            className="-rotate-90 shrink-0"
                          />
                        </button>
                      </li>
                    ) : (
                      // Leaf-less group (2-level menu): a direct link.
                      <li key={group.id} className="border-b border-gray-50">
                        <NavLink
                          to={group.seeAllUrl ?? '#'}
                          onClick={close}
                          className={({isActive}) =>
                            `block py-3.5 text-[14px] font-semibold transition-colors ${
                              isActive
                                ? 'text-[#FC6514]'
                                : 'text-[var(--color-header-text)] hover:text-[#FC6514]'
                            }`
                          }
                        >
                          {group.title}
                        </NavLink>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            )}
          </div>

          {/* Level 2: leaf items inside a group */}
          <div
            className={`absolute inset-0 transition-transform duration-250 ease-out overflow-y-auto ${
              panel.level === 2 ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {panel.level === 2 && (
              <nav aria-label={`${panel.group.title} links`}>
                {/* "See All" for this group */}
                {panel.group.seeAllUrl && (
                  <div className="px-5 pt-4 pb-2">
                    <Link
                      to={panel.group.seeAllUrl}
                      onClick={close}
                      className="text-[13px] font-semibold text-[#FC6514] hover:underline"
                    >
                      See All {panel.group.title}
                    </Link>
                  </div>
                )}
                <ul className="flex flex-col px-5 pb-6 pt-2">
                  {panel.group.items.map((leaf) => (
                    <li key={leaf.id} className="border-b border-gray-50">
                      <NavLink
                        to={leaf.url}
                        onClick={close}
                        className={({isActive}) =>
                          `block py-3 text-[14px] transition-colors ${
                            isActive
                              ? 'text-[#FC6514] font-medium'
                              : 'text-[#555] hover:text-[#FC6514]'
                          }`
                        }
                      >
                        {leaf.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
