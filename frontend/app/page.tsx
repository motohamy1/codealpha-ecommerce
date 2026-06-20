import dynamic from "next/dynamic";
import Hero from "../components/Hero";

const ProductList = dynamic(() => import("../components/ProductList"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-12 border-b border-border pb-8">
        <div className="skeleton mb-2 h-8 w-40" />
        <div className="skeleton h-5 w-24" />
      </div>
      <div className="border-r border-b border-border overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-border bg-border gap-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white p-5 flex flex-col h-full min-h-[380px]">
              <div className="skeleton mb-4 aspect-[4/5] w-full" />
              <div className="skeleton mb-2 h-4 w-20" />
              <div className="skeleton mb-3 h-5 w-3/4" />
              <div className="skeleton h-5 w-16 mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProductList />
    </>
  );
}
