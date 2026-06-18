import type { Metadata } from "next";
import CartProvider from "../components/CartProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUXE — Premium E-Commerce",
  description: "Discover curated premium products. Quality you can feel, delivered to your door.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-canvas text-ink">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
