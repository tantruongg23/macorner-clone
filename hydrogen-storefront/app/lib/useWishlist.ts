import {useState, useEffect, useCallback} from 'react';

const STORAGE_KEY = 'harpera:wishlist';

export interface WishlistItem {
  handle: string;
  title: string;
  image?: string | null | undefined;
  price?: string;
}


export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setItems(raw ? (JSON.parse(raw) as WishlistItem[]) : []);
    } catch {
      setItems([]);
    }
  }, []);

  // Keep multiple tabs in sync
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      try {
        setItems(e.newValue ? (JSON.parse(e.newValue) as WishlistItem[]) : []);
      } catch {
        setItems([]);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.handle === item.handle)) return prev;
      const next = [...prev, item];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((handle: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.handle !== handle);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const has = useCallback(
    (handle: string) => items.some((i) => i.handle === handle),
    [items],
  );

  return {items, count: items.length, add, remove, has};
}
