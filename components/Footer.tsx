import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact us" },
  { href: "/products", label: "Shop" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-base font-semibold text-ink">Northstar Supply</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Better daily rituals for coffee and tea lovers, with a storefront that is ready for mock checkout now and live payments later.
          </p>
          <p className="mt-4 text-sm text-slate-400">© {year} Northstar Supply</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:justify-self-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Explore</p>
            <nav className="mt-3 flex flex-col gap-3 text-sm text-slate-600">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-brand">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Support</p>
            <div className="mt-3 space-y-3 text-sm text-slate-600">
              <p>Mock checkout enabled by default.</p>
              <p>Stripe keys can be added later with no UI rewrites.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
