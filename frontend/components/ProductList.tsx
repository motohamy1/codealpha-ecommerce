"use client";

import { useEffect, useState, useMemo } from "react";
import { AlertCircle, RefreshCw, PackageSearch, Search, X } from "lucide-react";
import { fetchProducts } from "../lib/api";
import type { Product } from "../lib/types";
import ProductCard from "./ProductCard";

type SortKey = "default" | "price-asc" | "price-desc" | "name";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="skeleton mb-4 aspect-[4/5] w-full" />
      <div className="skeleton mb-2 h-4 w-20" />
      <div className="skeleton mb-3 h-5 w-3/4" />
      <div className="skeleton h-5 w-16" />
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
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">Shop All</h2>
          <p className="mt-2 text-muted">
            {loading
              ? "Loading products…"
              : `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`}
          </p>
        </div>

        {/* Search & Sort */}
        {!loading && !error && products.length > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                id="product-search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-white pl-10 pr-9 py-2 text-sm text-ink transition-colors hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-ink/10 sm:w-64"
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

            {/* Sort */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-ink/10"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Category filter */}
      {!loading && !error && categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === cat
                  ? "bg-ink text-white"
                  : "border border-border bg-white text-muted hover:border-stone-400 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-20 text-center">
          <AlertCircle className="mb-4 h-10 w-10 text-stone-400" />
          <p className="text-lg font-semibold text-ink">Something went wrong</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <button
            onClick={retry}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-ink/20"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-20 text-center">
          <PackageSearch className="mb-4 h-10 w-10 text-stone-400" />
          <p className="text-lg font-semibold text-ink">No products found</p>
          <p className="mt-1 text-sm text-muted">
            {category !== "All"
              ? `No items in "${category}". Try a different category.`
              : "Products will appear here once the backend is seeded."}
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    </section>
  );
}
