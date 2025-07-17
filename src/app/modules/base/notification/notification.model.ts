import { model, Schema } from "mongoose";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { INotification } from "./notification.inerface";
const NotificationSchema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "",
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverEmail: {
      type: String,
      default: "",
    },

    receiverRole: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },

    type: {
      type: String,
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: {
      type: String,
      default: null,
    },

    fcmToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = model<INotification>("Notification", NotificationSchema);
export default Notification;
