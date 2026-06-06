import {Link, NavLink} from 'react-router';
import {useAside} from '~/components/Aside';
import {useEffect, useRef, useState} from 'react';
import type {MenuItemNode} from '~/lib/navigation';
import {ChevronDownIcon, XIcon} from './icons';

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavDrawer({
  navigationTree,
}: {
  navigationTree?: MenuItemNode[] | null;
}) {
  const {type, close} = useAside();
  const isOpen = type === 'mobile';
  const navData = navigationTree ?? [];
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Move focus into drawer on open
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
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
  }, [isOpen, close]);

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
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100 shrink-0">
          <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--color-header-text)]">
            Menu
          </span>
          <button
            ref={closeButtonRef}
            onClick={close}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
          >
            <XIcon width={20} height={20} />
          </button>
        </div>

        {/* Nav tree */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto"
        >
          <ul className="flex flex-col px-5 py-2">
            {navData.map((item) => (
              <NavItem key={item.id} item={item} onClose={close} />
            ))}
          </ul>
        </nav>

        {/* Bottom utility links */}
        <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3 shrink-0">
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
    </>
  );
}

function NavItem({
  item,
  onClose,
}: {
  item: MenuItemNode;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.items && item.items.length > 0;

  if (!hasChildren) {
    return (
      <li className="border-b border-gray-50">
        <NavLink
          to={item.url}
          onClick={onClose}
          className={({isActive}) =>
            `block py-3.5 text-[14px] font-semibold transition-colors ${
              isActive
                ? 'text-[#FC6514]'
                : 'text-[var(--color-header-text)] hover:text-[#FC6514]'
            }`
          }
          aria-current={undefined}
        >
          {item.title}
        </NavLink>
      </li>
    );
  }

  return (
    <li className="border-b border-gray-50">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 text-[14px] font-semibold text-[var(--color-header-text)] hover:text-[#FC6514] transition-colors"
        aria-expanded={expanded}
      >
        <span>{item.title}</span>
        <ChevronDownIcon
          width={14}
          height={14}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <ul className="pl-4 pb-3 flex flex-col">
          {item.items!.map((sub) => (
            <SubNavItem key={sub.id} item={sub} onClose={onClose} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SubNavItem({
  item,
  onClose,
}: {
  item: MenuItemNode;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.items && item.items.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <NavLink
          to={item.url}
          onClick={onClose}
          className={({isActive}) =>
            `block py-2 text-[14px] transition-colors ${
              isActive ? 'text-[#FC6514] font-medium' : 'text-[#555] hover:text-[#FC6514]'
            }`
          }
        >
          {item.title}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between py-2 text-[13px] font-semibold text-[#333] hover:text-[#FC6514] transition-colors"
        aria-expanded={expanded}
      >
        <span>{item.title}</span>
        <ChevronDownIcon
          width={12}
          height={12}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <ul className="pl-3 flex flex-col">
          {item.items!.map((leaf) => (
            <li key={leaf.id}>
              <NavLink
                to={leaf.url}
                onClick={onClose}
                className={({isActive}) =>
                  `block py-1.5 text-[13px] transition-colors ${
                    isActive ? 'text-[#FC6514] font-medium' : 'text-[#666] hover:text-[#FC6514]'
                  }`
                }
              >
                {leaf.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
