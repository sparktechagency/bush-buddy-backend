import { CONFIG } from "../../../core/config";
import { transporter } from "./mail.transporter";

export const sendEmailWithLink = async (
  to: string,
  subject: string,
  link: string
) => {
  await transporter.sendMail({
    from: CONFIG.MAIL.send_from,
    to,
    subject: subject,
    text: "Set your new password within 5 minutes",
    html: `

    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Email</title>
  <style>
    /* General styling */
    body {
      margin: 0;
      padding: 50px 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      color: #333;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: #f4f4f4;
    }

    .container {
      width: 100%;
      max-width: 600px;
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 30px;
      text-align: center;
      border: 1px solid #9C4B9F;
    }

    h1 {
      font-size: 28px;
      color: #2C1A59;
      margin-bottom: 20px;
      font-weight: 600;
    }

    p {
      font-size: 16px;
      color: #555555;
      margin-bottom: 10px;
      line-height: 1.6;
    }

    .reset-button {
      display: inline-block;
      width: 100%;
      font-size: 14px;
      font-weight: bold;
      color: blue;
      border-radius: 8px;
      margin-bottom: 20px;
      text-transform: uppercase;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .reset-button a {
      text-decoration: underline;
      color: #9C4B9F;
    }

    .footer-text {
      font-size: 14px;
      color: #777777;
      margin-top: 5px;
      line-height: 1.6;
    }

    /* Mobile responsiveness */
    @media only screen and (max-width: 600px) {
      .container {
        padding: 20px;
      }

      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }

      .reset-button a {
        font-size: 16px;
      }

      .footer-text {
        font-size: 12px;
      }
    }

  </style>
</head>
<body>
  <table role="presentation">
    <tr>
      <td align="center">
        <div class="container">
          <h1>Reset Your Password</h1>
          <p>We received a request to reset your password. You can reset it by clicking the link below:</p>

          <div class="reset-button">
            <a href="${link}">Reset Your Password</a>
          </div>

          <p class="footer-text">
            If you didn't request this, please ignore this email. Your account is safe with us.    
            This reset link will expire in 
            <strong style="color: #9C4B9F; font-weight: 600;">${CONFIG.MAIL.forgot_pass_link_expire}</strong> minutes.
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>


`,
  });
};
