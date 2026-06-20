"use client";

import { ShoppingBag, Search, Menu } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

const NAV_LINKS = [
  { label: "Shop", href: "/#products" },
  { label: "Collections", href: "/#products" },
  { label: "About", href: "/#about" },
  { label: "Admin", href: "/admin" },
];

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#") || href.startsWith("#")) {
      const hash = href.substring(href.indexOf("#"));
      if (window.location.pathname === "/") {
        e.preventDefault();
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
        }
      }
    }
  };

  const handleSearchClick = () => {
    if (window.location.pathname !== "/") {
      window.location.href = "/#products";
      setTimeout(() => {
        const input = document.getElementById("product-search-input") as HTMLInputElement;
        if (input) input.focus();
      }, 500);
    } else {
      const input = document.getElementById("product-search-input") as HTMLInputElement;
      if (input) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => input.focus(), 400);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          className="lg:hidden text-ink"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-ink"
        >
          LUXE
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link.href)}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSearchClick}
            className="text-muted transition-colors hover:text-ink"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            onClick={openDrawer}
            className="relative text-muted transition-colors hover:text-ink"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-border px-4 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link.href)}
              className="block py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
