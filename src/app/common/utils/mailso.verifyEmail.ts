/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { CONFIG } from "../../core/config";
import AppError from "../../core/error/AppError";

export const isEmailVerified = async (email: string) => {
  try {
    const response = await fetch(
      `https://api.mails.so/v1/validate?email=${email}`,
      {
        method: "GET",
        headers: {
          "x-mails-api-key": CONFIG.MAIL_SO.mails_so_api_key as string,
        },
      }
    );

    const result = await response.json();
    const data = result.data;

    // Console log for debugging
    // console.log("📨 Mailso verification:", data);

    if (
      data.result === "deliverable" &&
      data.isv_format &&
      data.isv_domain &&
      data.isv_mx &&
      data.isv_noblock &&
      data.isv_nocatchall &&
      data.isv_nogeneric &&
      !data.is_disposable
    ) {
      return { success: true, message: "Valid email ✅" };
    }

    throw new AppError(httpStatus.BAD_REQUEST, "Email is not valid!");
  } catch (error: any) {
    console.error("❌ Email verification error:", error.message);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || "Email verification failed!"
    );
  }
};
