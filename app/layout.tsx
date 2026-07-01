import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Northstar Supply",
  description: "A polished storefront for coffee, tea, and brewing essentials.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-sand text-ink">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
