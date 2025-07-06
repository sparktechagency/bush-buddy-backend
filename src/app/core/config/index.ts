import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const CONFIG = {
  CORE: {
    ip: process.env.IP,
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    backend_url: process.env.BACKEND_URL,
    socket_port: process.env.SOCKET_PORT,
    db_uri: process.env.DATABASE_URI,
    frontend_url: process.env.FRONTEND_URL,

    supper_admin_email: process.env.SUPPER_ADMIN_EMAIL,
    supper_admin_pass: process.env.SUPPER_ADMIN_PASS,
  },

  BCRYPT: { bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS },

  CLOUDINARY: {
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  // # JWT tokens
  JWT: {
    access_jwt_secret: process.env.ACCESS_JWT_SECRET,
    access_jwt_expires: process.env.ACCESS_JWT_EXPIRED,
    refresh_jwt_secret: process.env.REFRESH_JWT_SECRET,
    refresh_token_expires: process.env.REFRESH_JWT_EXPIRED,
    forgot_pass_secret: process.env.FORGOT_PASS_SECRET,
    password_reset_secret: process.env.PASSWORD_RESET_SECRET,
  },
  // # Mail and  OTP
  MAIL: {
    otp_length: process.env.OTP_LENGTH,
    service_user: process.env.SERVICE_USER,
    mail_app_pass: process.env.MAIL_APP_PASS,
    otp_expires: process.env.OTP_EXPIRE,
    forgot_pass_link_expire: process.env.FORGOT_PASS_LINK_EXPIRE,
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    send_from: process.env.SEND_FROM,
  },

  // # AWS CREDENTIAL
  AWS: {
    aws_region: process.env.AWS_REGION,
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    aws_bucket: process.env.AWS_BUCKET,
  },

  // # Mail so email checker credentials
  MAIL_SO: {
    mails_so_api_key: process.env.MAILS_SO_API_KEY,
  },

  //  # Stripe
  STRIPE: {
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEB_HOOK_SECRET,
  },

  // TWILIO
  TWILIO: {
    twilio_acc_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_token: process.env.TWILIO_TOKEN,
    twilio_msg_service_id: process.env.TWILIO_MSG_SERVICE_ID,
  },

  // Other
  OTHER: {
    open_weather_pai_key: process.env.OPENWEATHER_API_KEY,
  },
};
