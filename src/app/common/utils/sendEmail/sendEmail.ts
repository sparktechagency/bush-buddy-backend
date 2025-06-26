import { CONFIG } from "../../../core/config";
import { transporter } from "./mail.transporter";

export const sendEmail = async (
  to: string,
  subject: string,
  htmlEmailBody: string
) => {
  await transporter.sendMail({
    from: CONFIG.MAIL.send_from,
    to,
    subject,
    text: `Set your new password within ${CONFIG?.MAIL.otp_expires} minutes`,
    html: htmlEmailBody,
  });
};
