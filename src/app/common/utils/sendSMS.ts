/* eslint-disable @typescript-eslint/no-explicit-any */
import twilio from "twilio";
import { CONFIG } from "../../core/config";

const client = twilio(CONFIG.TWILIO.twilio_acc_sid, CONFIG.TWILIO.twilio_token);

const sendSMS = (number: string) => {
  client.messages
    .create({
      body: "Ahoy  Ali👋",
      messagingServiceSid: CONFIG.TWILIO.twilio_msg_service_id,
      to: number,
    })
    .then((message: any) => {
      console.info(message?.sid);
      console.info(message?.status);
    });
};

export default sendSMS;
