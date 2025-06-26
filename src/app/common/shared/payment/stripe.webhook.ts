/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { CONFIG } from "../../../core/config";
import catchAsync from "../../utils/catchAsync";
import { stripe } from "./stripe";

export const isPaymentSuccess = catchAsync(async (req, res) => {
  console.log("🔥 Hello From STRIPE WEB_HOOK:", req.body);
  const webhookSecret = CONFIG.STRIPE.stripe_webhook_secret as string;
  console.log("🚀 ~ isPaymentSuccess ~ webhookSecret:", webhookSecret);

  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    // const session = event.data.object as Stripe.Checkout.Session;
    // const paymentIntentId = session.payment_intent;

    try {
      // const pi = await stripe.paymentIntents.retrieve(
      //   paymentIntentId as string
      // );
      // const amountReceived = pi.amount_received;
      // const fee = pi.application_fee_amount;
      // const sellerId = pi.transfer_data?.destination;
      // // Update the seller's payment status in the database
      // await Tips.findByIdAndUpdate(sellerId, {
      //   isPaid: true,
      //   adminFee: fee,
      //   method: pi.payment_method_types?.[0],
      //   currency: pi.currency,
      //   transactionId: paymentIntentId,
      // });
      // console.log("✅ Payment Success");
      // console.log(`💰 Total: ${amountReceived / 100}`);
      // console.log(`🏦 Seller ID: ${sellerId}`);
      // console.log(`🧾 Admin Fee: ${fee && fee / 100}`);
    } catch (error) {
      console.error("Error processing payment intent:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.json({ received: true });
});
