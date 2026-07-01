import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import products from "@/data/products.json";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CartProvider } from "@/context/CartContext";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { checkoutSchema } from "@/lib/validations";
import type { Product } from "@/types/product";

const pushMock = vi.fn();
const sampleProduct = products[0] as Product;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
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
  beforeEach(() => {
    pushMock.mockReset();
    vi.restoreAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("shows the empty-cart message when nothing is in the cart", () => {
    render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    expect(screen.getByText("Your checkout is waiting on a cart")).toBeInTheDocument();
  });

  it("surfaces network errors and lets shoppers retry checkout", async () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ product: sampleProduct, quantity: 1 }]),
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "shopper@example.com");
    await user.type(screen.getByLabelText("First name"), "Ava");
    await user.type(screen.getByLabelText("Last name"), "Stone");
    await user.type(screen.getByLabelText("Address"), "123 Market Street");
    await user.type(screen.getByLabelText("City"), "Seattle");
    await user.type(screen.getByLabelText("State / region"), "WA");
    await user.type(screen.getByLabelText("Postal code"), "98101");
    await user.clear(screen.getByLabelText("Country"));
    await user.type(screen.getByLabelText("Country"), "United States");
    await user.type(screen.getByLabelText("Name on card"), "Ava Stone");
    await user.type(screen.getByLabelText("Card number"), "4242 4242 4242 4242");
    await user.type(screen.getByLabelText("Expiry"), "12/29");
    await user.type(screen.getByLabelText("CVC"), "123");
    await user.click(screen.getByRole("button", { name: "Place order" }));

    await waitFor(() => {
      expect(screen.getByText("Checkout is temporarily unavailable. Please try again.")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Place order" })).toBeEnabled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
