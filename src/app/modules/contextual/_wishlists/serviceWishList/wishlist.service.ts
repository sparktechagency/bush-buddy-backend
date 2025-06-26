/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import AppError from "../../../../core/error/AppError";
import { Service } from "../../service/service.model";
import { IWishList } from "./wishlist.interface";
import { ServiceWishList } from "./wishlist.model";

const createWishList = async (payload: IWishList) => {
  console.log("🚀 ~ createWishList ~ payload:", payload);
  const { user, itemId } = payload;

  const isItemExist: any = await Service.exists({ _id: itemId });

  if (!isItemExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This item is not exist!");
  }

  const isWishListExist = await ServiceWishList.findOne({
    user,
    itemId,
  });

  if (isWishListExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This item is already in your wish list!"
    );
  }

  const result = await ServiceWishList.create(payload);

  return result;
};

const getMyWishList = async (query: Record<string, unknown>) => {
  return ServiceWishList.find({ user: { $eq: query.user } }).populate({
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

  const isWishListExist = await ServiceWishList.findById(id);

  if (!isWishListExist) {
    throw new AppError(httpStatus.NOT_FOUND, "WishList is not exist!");
  }

  await ServiceWishList.findByIdAndDelete(id);
  return true;
};

export const WishList_service = {
  createWishList,
  getMyWishList,
  deleteWishList,
};
