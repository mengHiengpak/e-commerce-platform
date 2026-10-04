"use client";

import { useSyncExternalStore } from "react";

import type { Product } from "@/lib/types";

/**
 * Cart contents, persisted to `localStorage`.
 *
 * Modelled as a module-level external store read through `useSyncExternalStore`
 * rather than `useState` inside a provider. Two reasons:
 *
 * 1. The server has no `localStorage`, so a `useState` version has to start
 *    empty and correct itself in an effect — which is a `setState` in an effect
 *    and an extra render on every mount.
 * 2. `useSyncExternalStore` gives the real value on the first client render and
 *    reconciles with the server HTML immediately after hydration, so the header
 *    count never flashes the wrong number.
 *
 * Each line snapshots the name and price at the moment it is added. The catalog
 * lives in MongoDB and is never bundled into the client, so there is no local
 * price table to resolve a line against — without the snapshot the header total
 * would read $0.00.
 */

export type CartLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

/** Bumped to v2 because lines gained `name`/`price`; older payloads are dropped. */
const STORAGE_KEY = "chic-threads.cart.v2";

/** Stable empty snapshot: `getSnapshot` must not allocate a new array. */
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.id === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    Number.isFinite(line.price) &&
    typeof line.quantity === "number"
  );
}

function getSnapshot(): CartLine[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? parsed.filter(isCartLine) : EMPTY;
  } catch {
    // Corrupt payload or storage blocked: fall back to an empty cart.
    cache = EMPTY;
  }
  return cache;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function setLines(next: CartLine[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or quota exceeded: the cart still works for this session.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export type Cart = {
  lines: CartLine[];
  itemCount: number;
  total: number;
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export function useCart(): Cart {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce((sum, line) => sum + line.quantity * line.price, 0),
    add: (product) => {
      const current = getSnapshot();
      const existing = current.find((line) => line.id === product.id);

      setLines(
        existing
          ? current.map((line) =>
              line.id === product.id
                ? // Re-adding refreshes the snapshot, so a later price change sticks.
                  { ...line, name: product.name, price: product.price, quantity: line.quantity + 1 }
                : line,
            )
          : [
              ...current,
              { id: product.id, name: product.name, price: product.price, quantity: 1 },
            ],
      );
    },
    remove: (id) => setLines(getSnapshot().filter((line) => line.id !== id)),
    setQuantity: (id, quantity) => {
      const current = getSnapshot();
      setLines(
        quantity <= 0
          ? current.filter((line) => line.id !== id)
          : current.map((line) => (line.id === id ? { ...line, quantity } : line)),
      );
    },
    clear: () => setLines(EMPTY),
  };
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number): string {
  return currency.format(value);
}