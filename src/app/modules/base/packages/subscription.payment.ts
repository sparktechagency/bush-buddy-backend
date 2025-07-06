/* eslint-disable no-console */
import Stripe from "stripe";
import { CONFIG } from "../../../core/config";

export const stripe = new Stripe(CONFIG.STRIPE.stripe_secret_key as string, {
  apiVersion: "2025-04-30.basil",
});

interface UserInfo {
  id: string;
  subscriptionID: string;
  email: string;
  name: string;
  deadline: string;
  deadlineType: string;
  issuedAt: Date;
}

async function createStripeSubscriptionSession(
  amount: number,
  user: UserInfo,
  currency: string
) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }
  if (!user || !user.id) {
    throw new Error("User info with valid id is required");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Custom Subscription",
            },
            unit_amount: 10 * 100,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      metadata: {
        userEmail: user.email || "",
        userName: user.name || "",
        subscriptionID: user.subscriptionID,
        deadline: user.deadline,
        deadlineType: user.deadlineType || null,
      },
      success_url: `${CONFIG.CORE.backend_url}/subscription/success-api-stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://192.168.10.180:5200/cancel",
    });

    return session.url;
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Failed to create checkout session");
  }
}

export const subscription_payment = { createStripeSubscriptionSession };
