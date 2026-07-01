import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormValues {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}
