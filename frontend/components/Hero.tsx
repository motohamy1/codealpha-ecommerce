import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-white">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-stone-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted animate-fade-up">
            New Collection 2026
          </p>
          <h1 className="text-5xl font-bold leading-[1.05] text-ink sm:text-6xl lg:text-7xl animate-fade-up stagger-1">
            Quality you can
            <br />
            <span className="text-stone-400">feel.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted animate-fade-up stagger-2">
            Discover curated premium products from independent makers.
            Thoughtfully designed, ethically sourced, delivered to your door.
          </p>
          <div className="mt-10 flex items-center gap-4 animate-fade-up stagger-3">
            <a
              href="#products"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-ink/20"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
