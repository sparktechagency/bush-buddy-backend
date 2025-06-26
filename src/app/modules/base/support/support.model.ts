import mongoose, { model, Schema } from "mongoose";
import { ISupport } from "./support.interface";

const SupportSchema: Schema = new Schema<ISupport>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Support = model<ISupport>("Support", SupportSchema);

export default Support;
