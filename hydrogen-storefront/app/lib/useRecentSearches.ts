import {useState, useCallback} from 'react';

const STORAGE_KEY = 'macorner:recent-searches';
const MAX_ITEMS = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]
      ).slice(0, MAX_ITEMS);
    } catch {
      return [];
    }
  });

  const save = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setSearches((prev) => {
      const deduped = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(
        0,
        MAX_ITEMS,
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
      } catch {}
      return deduped;
    });
  }, []);

  const remove = useCallback((term: string) => {
    setSearches((prev) => {
      const next = prev.filter((s) => s !== term);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return {searches, save, remove, clear};
}
