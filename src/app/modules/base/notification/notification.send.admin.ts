/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { CONFIG } from "../../../core/config";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { User } from "../user/user.model";
import { sendNotification } from "./notification.utils";

export interface IAdminSendNotificationPayload {
  sender: mongoose.Types.ObjectId;
  type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
  title: string;
  message: string;
  link?: string;
}

export const sendAdminNotifications = async (
  payload: IAdminSendNotificationPayload
) => {
  const admin = await User.findOne({
    email: CONFIG.CORE.supper_admin_email,
    role: USER_ROLE.ADMIN,
    "verification.verified": true,
    isDeleted: false,
    status: "active",
  }).select("fcmToken email _id");

  if (admin?.fcmToken) {
    sendNotification([admin.fcmToken], {
      sender: payload.sender,
      receiver: admin?._id as any,
      receiverEmail: admin?.email,
      receiverRole: USER_ROLE.ADMIN,
      title: payload.title,
      message: payload.message,
      type: payload.type as any,
      link: payload.link,
    });
  }
};
