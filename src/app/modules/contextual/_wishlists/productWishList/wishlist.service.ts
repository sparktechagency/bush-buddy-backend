/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import AppError from "../../../../core/error/AppError";
import { Product } from "../../product/product.model";
import { IWishList } from "./wishlist.interface";
import { ProductWishList } from "./wishlist.model";

const createWishList = async (payload: IWishList) => {
  const { user, itemId } = payload;

  const isItemExist: any = await Product.exists({ _id: payload.itemId });

  if (!isItemExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This item is not exist!");
  }

  const isWishListExist = await ProductWishList.findOne({
    user,
    itemId,
  });

  if (isWishListExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This item is already in your wish list!"
    );
  }

  const result = await ProductWishList.create(payload);

  return result;
};

const getMyWishList = async (query: Record<string, unknown>) => {
  return ProductWishList.find({ user: { $eq: query.user } }).populate({
    path: "itemId",
    select: "name price featureImage stock",
    populate: {
      path: "category owner",
      select: "name profileImage email",
    },
  });
};

const deleteWishList = async (id: ObjectId) => {
  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "WishList id is not found in params url"
    );
  }

  const isWishListExist = await ProductWishList.findById(id);

  if (!isWishListExist) {
    throw new AppError(httpStatus.NOT_FOUND, "WishList is not exist!");
  }

  await ProductWishList.findByIdAndDelete(id);
  return true;
};

export const WishList_service = {
  createWishList,
  getMyWishList,
  deleteWishList,
};
