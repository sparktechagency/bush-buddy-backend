import Stripe from "stripe";
import { CONFIG } from "../../../core/config";

export const stripe = new Stripe(CONFIG.STRIPE.stripe_secret_key as string, {
  apiVersion: "2025-04-30.basil",
});
