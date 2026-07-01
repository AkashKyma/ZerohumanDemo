import React from "react";
import { render, screen } from "@testing-library/react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CartProvider } from "@/context/CartContext";
import { checkoutSchema } from "@/lib/validations";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("checkoutSchema", () => {
  it("accepts a valid checkout payload", () => {
    const result = checkoutSchema.safeParse({
      email: "shopper@example.com",
      firstName: "Ava",
      lastName: "Stone",
      address: "123 Market Street",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
      cardName: "Ava Stone",
      cardNumber: "4242 4242 4242 4242",
      expiry: "12/29",
      cvc: "123",
    });

    expect(result.success).toBe(true);
  });
});

describe("CheckoutForm", () => {
  it("shows the empty-cart message when nothing is in the cart", () => {
    render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    expect(screen.getByText("Your checkout is waiting on a cart")).toBeInTheDocument();
  });
});
