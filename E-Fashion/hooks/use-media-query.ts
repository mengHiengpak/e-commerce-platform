"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query from React.
 *
 * Implemented with `useSyncExternalStore` rather than `useState` + `useEffect`,
 * because a media query is an external store: the browser owns the value and
 * tells us when it changes. This also means the first client render already has
 * the real value instead of a default that gets corrected a frame later, and
 * `getServerSnapshot` keeps the server HTML consistent with it.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Matches Tailwind's `sm` breakpoint (40rem). */
export function useIsTabletOrLarger(): boolean {
  return useMediaQuery("(min-width: 40rem)");
}

/** Matches Tailwind's `md` breakpoint (48rem), i.e. phone vs tablet and up. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 48rem)");
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
