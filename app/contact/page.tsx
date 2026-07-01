import Link from "next/link";

const contactChannels = [
  {
    title: "Customer support",
    detail: "support@northstarsupply.demo",
    description: "Questions about your order, checkout, or product recommendations.",
  },
  {
    title: "Wholesale",
    detail: "partners@northstarsupply.demo",
    description: "Bulk orders, gifting, and café partnership conversations.",
  },
  {
    title: "Studio hours",
    detail: "Mon–Fri · 9am–5pm UTC",
    description: "We usually reply within one business day.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Contact us</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">We can help with orders, gifts, and brewing questions.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">
            Reach out anytime and we will point you to the right coffee, tea, or countertop gear for the moment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="mailto:support@northstarsupply.demo" className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark">
              Email support
            </a>
            <Link href="/about" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
              Learn about us
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">How to reach us</h2>
          <div className="mt-6 space-y-5">
            {contactChannels.map((channel) => (
              <article key={channel.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                <h3 className="text-base font-semibold text-ink">{channel.title}</h3>
                <p className="mt-2 text-sm font-medium text-brand">{channel.detail}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{channel.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
