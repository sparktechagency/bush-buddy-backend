export const generateSosAlertEmail = (
  userName: string,
  location: string
): string => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.08); overflow: hidden;">
        
        <div style="background-color: #b71c1c; padding: 20px 30px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">
            ⚠️ Urgent Safety Alert
          </h2>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #444;">Dear Concern,</p>

          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            This is to urgently inform you that <strong style="color: #1b5e20;">${userName}</strong> may be in a
            <strong style="color: #d32f2f;">potentially dangerous situation</strong> at the following location:
          </p>

          <div style="background-color: #fff3e0; padding: 16px; margin: 20px 0; border-left: 6px solid #e53935; font-size: 16px;">
            📍 <strong>Location:</strong> ${location}
          </div>

          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            This alert was automatically triggered by our safety system. Immediate attention may be required. If you can assist or reach out to
            <strong>${userName}</strong>, please do so without delay.
          </p>

          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Our team is actively monitoring the situation and will provide any updates as necessary.
          </p>

          <p style="margin-top: 30px; font-size: 15px;">Stay safe,</p>
          <p style="font-weight: bold; color: #333;">The Security Monitoring Team</p>
        </div>

        <div style="background-color: #eeeeee; padding: 16px 30px; text-align: center;">
          <p style="font-size: 12px; color: #777; margin: 0;">
            ⚠️ This email was sent automatically by our safety system. Please do not reply to this message.
          </p>
        </div>
      </div>
    </div>
  `;
};
