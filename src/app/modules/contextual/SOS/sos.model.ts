import { Schema, model } from "mongoose";
import { ISos } from "./sos.interface";

const sosSchema = new Schema<ISos>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt
  }
);

// 👉 Export Mongoose model
export const Sos = model<ISos>("Sos", sosSchema);
