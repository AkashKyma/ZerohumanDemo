import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  address: z.string().min(5, "Enter a street address."),
  city: z.string().min(2, "Enter a city."),
  state: z.string().min(2, "Enter a state or region."),
  postalCode: z.string().min(4, "Enter a postal code."),
  country: z.string().min(2, "Enter a country."),
  cardName: z.string().min(2, "Enter the name on card."),
  cardNumber: z
    .string()
    .regex(/^(?:\d{4}\s?){4}$/, "Use a 16-digit card number."),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, "Use MM/YY format."),
  cvc: z.string().regex(/^\d{3,4}$/, "Use a valid security code."),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
