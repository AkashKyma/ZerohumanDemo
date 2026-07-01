"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-ink">
          Northstar Supply
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "text-brand" : "transition hover:text-brand"}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="rounded-full bg-brand px-4 py-2 text-white transition hover:bg-brand-dark"
          >
            Cart ({itemCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}
