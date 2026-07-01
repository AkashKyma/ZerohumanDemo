import Link from "next/link";

const values = [
  {
    title: "Thoughtful sourcing",
    description: "We curate coffees, teas, and gear that feel good to use every day and easy to gift.",
  },
  {
    title: "Simple buying flow",
    description: "From product discovery to checkout, the storefront stays fast, clear, and ready for future payments.",
  },
  {
    title: "Useful essentials",
    description: "We focus on reliable brewing tools and pantry staples instead of overcrowding the catalog.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">About</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Built for calm, confident daily brewing.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">
            Northstar Supply is a focused storefront for coffee and tea lovers who want better ingredients, better tools, and a smoother path to checkout.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            This demo shop highlights a practical retail experience: clean browsing, persistent cart behavior, and an easy transition from mock checkout today to live payments later.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark">
              Explore products
            </Link>
            <Link href="/contact" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
              Contact us
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">What matters here</h2>
          <div className="mt-6 space-y-5">
            {values.map((value) => (
              <article key={value.title}>
                <h3 className="text-base font-semibold text-ink">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{value.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
