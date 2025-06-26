import mongoose, { model, Schema } from "mongoose";
import { IWishList } from "./wishlist.interface";

// Mongoose Schema for Bookmark
const WishListSchema: Schema = new Schema<IWishList>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creating the model
export const ProductWishList = model<IWishList>(
  "ProductWishList",
  WishListSchema
);
