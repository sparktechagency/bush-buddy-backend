/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../core/error/AppError";
import { stripe } from "./stripe";

export const createTipsPayment: any = async (
  amount: number,
  sellerStripeAccountId: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: "usd",
      application_fee_amount: Math.round(amount * 0.1 * 100), // 10% fee
      transfer_data: {
        destination: sellerStripeAccountId,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Error creating payment intent"
    );
  }
};
