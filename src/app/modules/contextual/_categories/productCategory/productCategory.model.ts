import { model, Schema, Types } from "mongoose";
import { IProductCategory } from "./productCategory.interface";

const productCategory = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    creator: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    parent: {
      isParent: {
        type: Boolean,
        default: false,
      },
      parentCatId: {
        type: Types.ObjectId,
        ref: "ProductCategory",
        default: null,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
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

// Optional: model creation
export const ProductCat = model<IProductCategory>(
  "ProductCat",
  productCategory
);
