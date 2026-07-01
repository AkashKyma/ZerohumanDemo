import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";

function hasValidItems(value: unknown) {
  return Array.isArray(value) && value.some((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const candidate = item as { quantity?: unknown; product?: { id?: unknown; price?: unknown } };
    return (
      typeof candidate.quantity === "number" &&
      Number.isFinite(candidate.quantity) &&
      candidate.quantity > 0 &&
      typeof candidate.product?.id === "string" &&
      typeof candidate.product?.price === "number" &&
      Number.isFinite(candidate.product.price)
    );
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { values?: unknown; items?: unknown } | null;
  if (!body) {
    return NextResponse.json({ message: "Invalid checkout payload." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body.values);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: parsed.error.issues[0]?.message ?? "Invalid checkout payload.",
      },
      { status: 400 },
    );
  }

  if (!hasValidItems(body.items)) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const stripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY);

  return NextResponse.json({
    mode: stripeConfigured ? "ready-for-stripe" : "mock",
    orderId: `NS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  });
}
