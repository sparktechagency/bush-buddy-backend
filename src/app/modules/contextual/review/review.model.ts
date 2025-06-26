import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professionalism: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      validate: {
        validator: (v) => Number.isFinite(v) && v >= 0 && v <= 5,
        message: "Professionalism rating must be a number between 0 and 5.",
      },
    },
    timelines: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      validate: {
        validator: (v) => Number.isFinite(v) && v >= 0 && v <= 5,
        message: "Timelines rating must be a number between 0 and 5.",
      },
    },
    qualityOfService: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      validate: {
        validator: (v) => Number.isFinite(v) && v >= 0 && v <= 5,
        message: "Quality of Service rating must be a number between 0 and 5.",
      },
    },
    cleanliness: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      validate: {
        validator: (v) => Number.isFinite(v) && v >= 0 && v <= 5,
        message: "Cleanliness rating must be a number between 0 and 5.",
      },
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      validate: {
        validator: (v) => Number.isFinite(v) && v >= 0 && v <= 5,
        message: "Overall rating must be a number between 0 and 5.",
      },
    },
    valueForMoney: {
      type: String,
      enum: ["yes", "no", ""],
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },

    comments: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["accepted", "disputed", "pending"],
      default: "pending",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Review = model("Review", reviewSchema);
