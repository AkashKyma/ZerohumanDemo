import Link from "next/link";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Checkout</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Complete your order</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            This payment form is ready for a future Stripe integration, but it already supports a full mock purchase flow today.
          </p>
        </div>
        <Link href="/cart" className="text-sm font-semibold text-brand transition hover:text-brand-dark">
          Back to cart →
        </Link>
      </div>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
