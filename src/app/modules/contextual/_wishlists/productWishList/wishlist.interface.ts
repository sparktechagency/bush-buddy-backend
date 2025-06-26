import { ObjectId } from "mongoose";

export interface IWishList {
  user: ObjectId;
  itemId: ObjectId;
}
