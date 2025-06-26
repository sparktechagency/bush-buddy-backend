/* eslint-disable @typescript-eslint/no-explicit-any */

import { ObjectId } from "mongoose";

export interface INotification {
  sender?: ObjectId | undefined;
  receiver: ObjectId | undefined;
  receiverEmail: string | undefined;
  receiverRole: "buyer" | "seller" | "admin";
  message: string;
  fcmToken?: string;
  type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
  title?: string;
  isRead?: boolean;
  link?: string;
}

// export interface ISendNotification {
//   sender: string | undefined;
//   receiver: string | undefined;
//   receiverEmail: string | undefined;
//   receiverRole: string | undefined;
//   title: string;
//   link: string | null;
//   message: string;
//   type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
// }
