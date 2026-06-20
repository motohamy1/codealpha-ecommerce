"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  stock?: number;
}

export default function ProductCard({
  id,
  title,
  image,
  price,
  category,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem({ productId: id, title, image, price, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // toast handles success; on error the addItem promise rejects silently
    } finally {
      setAdding(false);
    }
  };

  const lowStock = stock !== undefined && stock > 0 && stock <= 5;
  const outOfStock = stock !== undefined && stock === 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-white transition-all duration-200 hover:ring-2 hover:ring-ink hover:z-10 relative">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 border-b border-border">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-100">
            <ShoppingBag className="h-8 w-8 text-stone-400" />
          </div>
        )}

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-[2px] bg-white border border-border px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest text-ink uppercase">
          {category}
        </span>

        {/* Stock badge */}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-[2px] bg-ink border border-ink px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest text-white uppercase">
            Sold out
          </span>
        )}
        {lowStock && !outOfStock && (
          <span className="absolute right-3 top-3 rounded-[2px] bg-white border border-orange-500 px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest text-orange-600 uppercase">
            Only {stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
          {category}
        </span>
        <h3 className="mt-1 text-base font-semibold leading-tight text-ink uppercase tracking-tight line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="text-lg font-bold text-ink tracking-tight">
            ${price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={adding || outOfStock}
            className={`inline-flex items-center justify-center gap-1.5 rounded-[2px] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              outOfStock
                ? "cursor-not-allowed bg-stone-100 text-stone-400 border border-border"
                : added
                  ? "bg-stone-500 text-white"
                  : "bg-ink text-white hover:bg-stone-700"
            }`}
          >
            {outOfStock ? (
              "Sold out"
            ) : added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Added
              </>
            ) : adding ? (
              "Adding…"
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
