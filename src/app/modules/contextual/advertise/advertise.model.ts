import mongoose, { model, Schema } from "mongoose";
import { IAdvertise } from "./advertise.interface";

const AdvertiseSchema: Schema = new Schema<IAdvertise>(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceCategory",
    },

     photos: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: String,
      default: new Date().toString(),
    },
    endDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approve", "reject"],
      default: "pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Advertise = model<IAdvertise>("Advertise", AdvertiseSchema);

export default Advertise;
