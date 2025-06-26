import httpStatus from "http-status";
import { CONFIG } from "../../../core/config";
import AppError from "../../../core/error/AppError";
import { stripe } from "./stripe";

export const createStripeAccountLink = async () => {
  // 1. Create a connected account
  const account = await stripe.accounts.create({
    type: "express",
  });

  // 2. Generate onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: CONFIG.CORE.frontend_url + "/refresh",
    return_url: CONFIG.CORE.frontend_url + "/return",
    type: "account_onboarding",
  });

  return {
    url: accountLink.url,
    accountId: account.id,
  };
};

export const isActiveId = async (accId: string) => {
  const account = await stripe.accounts.retrieve(accId);

  if (account.details_submitted && account.charges_enabled) {
    return {
      isOnboard: true,
      message: "✅ Onboarding complete. Seller can receive payments.",
    };
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Onboarding not complete. Seller payment id is not completed."
    );
  }
};
