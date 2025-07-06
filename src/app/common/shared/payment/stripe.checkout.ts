import { CONFIG } from "../../../core/config";
import { stripe } from "./stripe";

export const stripeCheckout = async (
  amount: number,
  accId: string,
  currency: string = "gbp",
  tipsId: string | null
) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }
  if (!tipsId) {
    throw new Error("Tips ID is required!");
  }

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: "Support Seller (Tip)",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    client_reference_id: tipsId?.toString() || "",
    mode: "payment",
    success_url: `${CONFIG.CORE.backend_url}/tips/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CONFIG.CORE.backend_url}/tips/cancel`,
    payment_intent_data: {
      application_fee_amount: Math.round(amount * 0.1 * 100),
      transfer_data: {
        destination: accId,
      },
    },
  });
};
