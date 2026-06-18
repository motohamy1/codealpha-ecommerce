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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/50 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
            <ShoppingBag className="h-10 w-10 text-stone-400" />
          </div>
        )}

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
          {category}
        </span>

        {/* Stock badge */}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-stone-900/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Sold out
          </span>
        )}
        {lowStock && !outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Only {stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-ink line-clamp-2">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted">{category}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-ink">
            ${price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={adding || outOfStock}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              outOfStock
                ? "cursor-not-allowed bg-stone-100 text-stone-400"
                : added
                  ? "bg-green-600 text-white"
                  : "bg-ink text-white hover:shadow-md hover:shadow-ink/20"
            }`}
          >
            {outOfStock ? (
              "Sold out"
            ) : added ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : adding ? (
              "Adding…"
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
