"use client";

import { useEffect, useState, useMemo } from "react";
import { AlertCircle, RefreshCw, PackageSearch, Search, X } from "lucide-react";
import { fetchProducts } from "../lib/api";
import type { Product } from "../lib/types";
import ProductCard from "./ProductCard";

type SortKey = "default" | "price-asc" | "price-desc" | "name";

function SkeletonCard() {
  return (
    <div className="bg-white p-5 flex flex-col h-full min-h-[380px]">
      <div className="skeleton mb-4 aspect-[4/5] w-full" />
      <div className="skeleton mb-2 h-4 w-20" />
      <div className="skeleton mb-3 h-5 w-3/4" />
      <div className="skeleton h-5 w-16 mt-auto" />
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("default");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      }
    }
  }, [loading]);

  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category)
      .filter((c): c is string => Boolean(c));
    return ["All", ...Array.from(new Set(cats))];
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
         (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }
    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [products, category, sort, searchQuery]);

  const retry = () => {
    setError(null);
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Editorial Header & Filtering Controls */}
      <div className="mb-12 border-b border-border pb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-muted uppercase mb-2">
            [ COLLECTION INDEX ]
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-ink">
            Shop All
          </h2>
          <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted">
            {loading
              ? "Loading products…"
              : `${filtered.length} ${filtered.length === 1 ? "item" : "items"} available`}
          </p>
        </div>

        {/* Search & Sort Panel */}
        {!loading && !error && products.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Brutalist Stark Search Bar */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                id="product-search-input"
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[2px] border border-border bg-white pl-10 pr-9 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink sm:w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Brutalist Select Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted whitespace-nowrap">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-[2px] border border-border bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-ink outline-none cursor-pointer transition-colors focus:border-ink"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low-High</option>
                <option value="price-desc">Price: High-Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Category filters */}
      {!loading && !error && categories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-[2px] px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-widest transition-colors ${
                category === cat
                  ? "bg-ink text-white border border-ink"
                  : "border border-border bg-white text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid container with exposed internal lines */}
      <div className="border-r border-b border-border overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-border bg-border gap-px">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center border-t border-l border-border bg-white py-24 text-center px-4">
            <AlertCircle className="mb-4 h-10 w-10 text-stone-400" />
            <h3 className="text-lg font-bold uppercase tracking-tight text-ink">Failed to load gallery</h3>
            <p className="mt-2 text-sm text-muted max-w-xs mx-auto">{error}</p>
            <button
              onClick={retry}
              className="mt-8 inline-flex items-center gap-2 rounded-[2px] bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-stone-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Gallery
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center border-t border-l border-border bg-white py-24 text-center px-4">
            <PackageSearch className="mb-4 h-10 w-10 text-stone-400" />
            <h3 className="text-lg font-bold uppercase tracking-tight text-ink">No items found</h3>
            <p className="mt-2 text-sm text-muted max-w-xs mx-auto">
              {category !== "All"
                ? `No products currently in the "${category}" archive.`
                : "The gallery is empty. Await backend sync."}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-border bg-border gap-px">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 6) * 0.08}s`, opacity: 0 }}
              >
                <ProductCard
                  id={product.id!}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  category={product.category || "Uncategorized"}
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
