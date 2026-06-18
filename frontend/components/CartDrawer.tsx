"use client";

import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, itemCount } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (id: string) => quantities[id] ?? items.find((i) => i.productId === id)?.quantity ?? 1;

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, getQty(id) + delta),
    }));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * getQty(item.productId),
    0,
  );

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-ink/40 animate-overlay backdrop-blur-sm"
        onClick={closeDrawer}
      />

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-ink" />
            <h2 className="text-lg font-semibold text-ink">
              Your Cart {itemCount > 0 && `(${itemCount})`}
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="rounded-full p-2 text-muted transition-colors hover:bg-stone-100 hover:text-ink"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <ShoppingBag className="h-8 w-8 text-stone-400" />
            </div>
            <p className="text-lg font-semibold text-ink">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted">
              Add some products to get started.
            </p>
            <button
              onClick={closeDrawer}
              className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-ink/20"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex gap-4 rounded-xl border border-border p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover bg-stone-100"
                    />
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-sm font-semibold text-ink line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="mt-auto flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.productId, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-stone-100 hover:text-ink"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-ink">
                            {getQty(item.productId)}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-stone-100 hover:text-ink"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          className="ml-auto text-muted transition-colors hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-xl font-bold text-ink">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="mb-4 text-xs text-muted">
                Shipping and taxes calculated at checkout.
              </p>
              <button className="w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-ink/20">
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
