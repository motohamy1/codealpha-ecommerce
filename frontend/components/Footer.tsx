import { Share2, AtSign, Globe } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: ["New Arrivals", "Best Sellers", "Collections", "Sale"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Sustainability", "Press"],
  },
  {
    title: "Support",
    links: ["Help Center", "Shipping", "Returns", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3
              className="text-2xl font-bold text-ink"
            >
              LUXE
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Premium products from independent makers. Thoughtfully designed,
              ethically sourced, delivered with care.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {[Share2, AtSign, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-all hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-ink">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} LUXE. All rights reserved.
          </p>
          <div className="mt-4 flex items-center gap-6 sm:mt-0">
            <a href="#" className="text-sm text-muted hover:text-ink">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted hover:text-ink">
              Terms
            </a>
            <a href="#" className="text-sm text-muted hover:text-ink">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
