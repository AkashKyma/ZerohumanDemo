"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products/manage", label: "Manage" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  if (href === "/products") {
    return pathname === href || (pathname.startsWith("/products/") && !pathname.startsWith("/products/manage"));
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-ink">
          Northstar Supply
        </Link>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
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
