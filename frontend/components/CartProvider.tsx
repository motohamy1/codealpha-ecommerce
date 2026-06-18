"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2, X } from "lucide-react";
import type { CartItem } from "../lib/types";
import { addToCart as addToCartAPI } from "../lib/api";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  isDrawerOpen: boolean;
  toast: string | null;
  addItem: (item: CartItem) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const addItem = useCallback(async (item: CartItem) => {
    await addToCartAPI(item.productId, item.quantity, item.price);

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });

    setToast(`${item.title} added to cart`);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, isDrawerOpen, toast, addItem, openDrawer, closeDrawer, dismissToast }}
    >
      {children}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] animate-toast-in">
          <div className="flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-2xl">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span>{toast}</span>
            <button
              onClick={dismissToast}
              className="ml-2 text-white/50 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}
