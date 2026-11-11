"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ITEM_BY_ID, OFFERS, type MenuItem } from "@/data/menu";

export type OrderLine = { id: string; qty: number };

type OrderCtx = {
  lines: OrderLine[];
  count: number;
  subtotal: number;
  unpriced: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  resolve: (id: string) => ProductLike | undefined;
};

export type ProductLike = Pick<
  MenuItem,
  "id" | "name" | "price" | "image" | "imageAlt"
>;

const KEY = "riccos-order-v1";
const Ctx = createContext<OrderCtx | null>(null);

const offerById = Object.fromEntries(OFFERS.map((o) => [o.id, o]));
const resolve = (id: string): ProductLike | undefined =>
  ITEM_BY_ID[id] ?? offerById[id];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(
            (l): l is OrderLine =>
              !!l &&
              typeof l.id === "string" &&
              Number.isInteger(l.qty) &&
              l.qty > 0 &&
              l.qty <= 50 &&
              !!resolve(l.id),
          );
          setLines(clean);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines, ready]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found)
        return prev.map((l) =>
          l.id === id ? { ...l, qty: Math.min(50, l.qty + qty) } : l,
        );
      return [...prev, { id, qty: Math.min(50, qty) }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(50, qty) } : l)),
    );
  }, []);
  const remove = useCallback(
    (id: string) => setLines((prev) => prev.filter((l) => l.id !== id)),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<OrderCtx>(() => {
    let count = 0;
    let subtotal = 0;
    let unpriced = 0;
    for (const l of lines) {
      count += l.qty;
      const p = resolve(l.id);
      if (p?.price == null) unpriced += l.qty;
      else subtotal += p.price * l.qty;
    }
    return {
      lines,
      count,
      subtotal,
      unpriced,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      resolve,
    };
  }, [lines, open, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrder must be used inside OrderProvider");
  return c;
}
