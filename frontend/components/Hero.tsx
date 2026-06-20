import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-border bg-white">
      {/* Left Column: Brand Editorial Copy & Call to Action */}
      <div className="lg:col-span-7 p-8 sm:p-16 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border min-h-[500px] lg:min-h-[600px]">
        <div className="max-w-xl animate-fade-up">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-muted">
            [ COLLECTION 2026 ]
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] text-ink tracking-tight uppercase">
            Quality
            <br />
            You Can
            <br />
            <span className="text-muted">Feel.</span>
          </h1>
          <p className="mt-8 text-base leading-relaxed text-muted max-w-md">
            Discover curated premium products from independent makers. 
            Bespoke craftsmanship, stark functionality, and raw aesthetic focus.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#products"
              className="group inline-flex items-center justify-center gap-2 rounded-[2px] bg-ink px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-stone-700"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-widest text-ink hover:text-stone-600 transition-colors border border-transparent hover:border-border rounded-[2px]"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: The Exposed Gallery Frame */}
      <div className="lg:col-span-5 p-8 sm:p-16 lg:p-20 bg-canvas flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px]">
        <div className="w-full max-w-sm flex flex-col animate-fade-up stagger-1">
          {/* Stark 1px border box representing the art frame */}
          <div className="border border-border bg-white p-4 rounded-[4px]">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/luxe_hero_product.png"
                alt="Featured Stark Black Leather Bag"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
          {/* Exposed brutalist image caption */}
          <div className="mt-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-muted uppercase px-1">
            <span>ART. NO. 2026-001</span>
            <span>[ STARK LIFESTYLE ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
