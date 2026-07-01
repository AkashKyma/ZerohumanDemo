"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { checkoutSchema, type CheckoutSchema } from "@/lib/validations";
import { formatPrice } from "@/lib/format";

const initialValues: CheckoutSchema = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, itemCount, subtotal, clearCart } = useCart();
  const [values, setValues] = useState<CheckoutSchema>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutSchema, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orderTotal = useMemo(() => subtotal + (itemCount > 0 ? 8 : 0), [itemCount, subtotal]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = checkoutSchema.safeParse(values);
    if (!result.success) {
      const nextErrors = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(Object.entries(nextErrors).map(([key, value]) => [key, value?.[0] ?? ""])) as Partial<
          Record<keyof CheckoutSchema, string>
        >,
      );
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: result.data, items }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setIsSubmitting(false);
      setErrors({ email: payload.message ?? "Checkout failed. Please try again." });
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "dem2-last-order",
        JSON.stringify({
          orderId: payload.orderId,
          total: orderTotal,
          email: values.email,
          itemCount,
          items,
        }),
      );
    }

    clearCart();
    setIsSubmitting(false);
    router.push(`/checkout/success?orderId=${payload.orderId}`);
  }

  function setField<K extends keyof CheckoutSchema>(key: K, value: CheckoutSchema[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  if (itemCount === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-soft">
        <h2 className="text-2xl font-semibold text-ink">Your checkout is waiting on a cart</h2>
        <p className="mt-3 text-slate-600">Add a few products first, then come back to finish the order.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Contact</h2>
            <p className="mt-1 text-sm text-slate-500">We will send receipts and delivery updates here.</p>
          </div>
          <Field label="Email" value={values.email} error={errors.email} onChange={(value) => setField("email", value)} />
        </section>

        <section className="space-y-4 border-t border-slate-200 pt-8">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Shipping address</h2>
            <p className="mt-1 text-sm text-slate-500">Fast form now, real shipping integration later.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" value={values.firstName} error={errors.firstName} onChange={(value) => setField("firstName", value)} />
            <Field label="Last name" value={values.lastName} error={errors.lastName} onChange={(value) => setField("lastName", value)} />
          </div>
          <Field label="Address" value={values.address} error={errors.address} onChange={(value) => setField("address", value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" value={values.city} error={errors.city} onChange={(value) => setField("city", value)} />
            <Field label="State / region" value={values.state} error={errors.state} onChange={(value) => setField("state", value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Postal code" value={values.postalCode} error={errors.postalCode} onChange={(value) => setField("postalCode", value)} />
            <Field label="Country" value={values.country} error={errors.country} onChange={(value) => setField("country", value)} />
          </div>
        </section>

        <section className="space-y-4 border-t border-slate-200 pt-8">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Payment</h2>
            <p className="mt-1 text-sm text-slate-500">
              Stripe-ready form boundary. When live keys are absent, checkout completes with a safe mock order.
            </p>
          </div>
          <Field label="Name on card" value={values.cardName} error={errors.cardName} onChange={(value) => setField("cardName", value)} />
          <Field label="Card number" value={values.cardNumber} error={errors.cardNumber} placeholder="4242 4242 4242 4242" onChange={(value) => setField("cardNumber", value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expiry" value={values.expiry} error={errors.expiry} placeholder="MM/YY" onChange={(value) => setField("expiry", value)} />
            <Field label="CVC" value={values.cvc} error={errors.cvc} placeholder="123" onChange={(value) => setField("cvc", value)} />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-ink">Review</h2>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
              <div>
                <p className="font-semibold text-ink">{item.product.name}</p>
                <p className="text-sm text-slate-500">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold text-ink">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{formatPrice(8)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Placing order..." : "Place order"}
        </button>
        <p className="mt-4 text-sm text-slate-500">Secure payment coming via Stripe Elements. Mock mode is active until keys are configured.</p>
      </aside>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function Field({ label, value, error, placeholder, onChange }: FieldProps) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <label htmlFor={id} className="block space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      {error ? <span className="block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
