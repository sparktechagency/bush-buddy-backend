import nodemailer from "nodemailer";
import { CONFIG } from "../../../core/config";

export const transporter = nodemailer.createTransport({
  host: CONFIG.MAIL.smtp_host,
  port: Number(CONFIG.MAIL.smtp_port),
  secure: CONFIG.CORE.node_env === "production",
  auth: {
    user: CONFIG.MAIL.service_user,
    pass: CONFIG.MAIL.mail_app_pass,
  },
});
