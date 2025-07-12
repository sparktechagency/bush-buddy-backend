import { model, Schema } from "mongoose";
import { IChat } from "./chat.interface";

// Define the schema for messages
const ChatSchema = new Schema<IChat>(
  {
    content: { type: String },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: { type: [String], default: [] },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    isImage: {
      type: Boolean,
      default: false,
    },

    isSenderRead: {
      type: Boolean,
      default: false,
    },
    isReceiverRead: {
      type: Boolean,
      default: false,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    chatTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the model
export const Chat = model("Chat", ChatSchema);
