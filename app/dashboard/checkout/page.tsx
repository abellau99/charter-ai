"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const params = useSearchParams();
  const options: StripeElementsOptions = {
    clientSecret: params!.get("cs") || undefined,
    // layout: {
    //   type: "tabs",
    // },
    appearance: {
      theme: "flat",
      variables: {
        colorPrimary: "#1C86EC",
        colorText: "#000000",
        colorDanger: "#df1b41",
        fontFamily: "Ideal Sans, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
        // See all possible variables below
      },
    },
  };

  return (
    <div className="p-4 w-3/4 mx-auto mob-max:w-auto">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
