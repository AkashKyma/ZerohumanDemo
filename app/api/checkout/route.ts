import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body.values);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: parsed.error.issues[0]?.message ?? "Invalid checkout payload.",
      },
      { status: 400 },
    );
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const stripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY);

  return NextResponse.json({
    mode: stripeConfigured ? "ready-for-stripe" : "mock",
    orderId: `NS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  });
}
