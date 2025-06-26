/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId, startSession, Types } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import AppError from "../../../core/error/AppError";
import { User } from "../../base/user/user.model";
import { Service } from "../service/service.model";

import { ServiceCat } from "../_categories/ServiceCategory/serviceCategory.model";
import { IAdvertise } from "./advertise.interface";
import Advertise from "./advertise.model";

const createAdvertise = async (payload: IAdvertise) => {
  if (!payload.categoryId) {
    throw new AppError(httpStatus.BAD_REQUEST, "CategoryId is required!");
  }
  const isCat = await ServiceCat.findOne({
    name:
      typeof payload.categoryId === "string"
        ? (payload.categoryId as string).toLocaleLowerCase()
        : payload.categoryId,
  });
  payload.categoryId = isCat?._id as any;

  const isService = await Service.findOne({
    seller: payload.creator,
  });

  const isAdd = await Advertise.findOne({
    creator: payload.creator,
    isDeleted: false,
    status: { $ne: "reject" },
  });

  if (!isService) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found!");
  }
  if (isAdd) {
    throw new AppError(httpStatus.BAD_REQUEST, "Add is allready exist!");
  }

  if (!isCat) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not exist!");
  }

  if (isCat.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is allready deleted!");
  }

  const result = await Advertise.create(payload);

  return result;
};

const getAdvertise = async (query: Record<string, any>) => {
  if (query?.createdAt) {
    // Convert the createdAt field to a Date if it is provided
    query.createdAt = new Date((query as any).createdAt);
    const { createdAt, remainingQuery } = query;

    // Get the start of the month
    const startOfMonth = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      1
    );

    // Get the end of the month (last day of the month)
    const endOfMonth = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const advertiseQuery = new QueryBuilder(
      Advertise.find({
        isDeleted: { $eq: false },
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }),
      remainingQuery
    )
      .search(["description", "discount"])
      .sort()
      .paginate()
      .fields();

    const meta = await advertiseQuery.countTotal();
    const data = await advertiseQuery.modelQuery;

    return { meta, data };
  }

  const advertiseQuery = new QueryBuilder(
    Advertise.find({ isDeleted: { $eq: false } })
      .populate({
        path: "creator",
        select: "firstName email profileImage",
      })
      .populate({
        path: "categoryId",
        select: "name",
      })
      .populate({
        path: "service",
        select: "serviceName priceRange discountPrice",
      }),

    query
  )
    .search(["description", "discount"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await advertiseQuery.countTotal();
  const data = await advertiseQuery.modelQuery;

  return { meta, data };
};

const getMyAdvertise = async (user: string, limit: number = 5) => {
  await User.isUserExistById(user as any);

  // return await Advertise.find({
  //   status: { $eq: "approve" },
  // }).sort("-createdAt");

  const myInterest: any = await User.findOne({ user }).select(
    "interestedCategories email"
  );

  let data = await Advertise.find({
    category: { $in: myInterest.interestedCategories },
    status: { $eq: "approve" },
  }).sort("-createdAt");

  if (myInterest.interestedCategories.length === 0 || data.length === 0) {
    console.log("1", myInterest.interestedCategories.length, data.length);
    const randomSkip = Math.floor(Math.random() * limit);
    const res = await Advertise.find({
      status: { $eq: "approve" },
    })
      .limit(limit)
      .skip(randomSkip)
      .sort("-createdAt");
    return res;
  }

  if (data.length > limit) {
    console.log(2);
    const randomSkip = Math.floor(Math.random() * (data.length - limit));
    data = await Advertise.find({
      category: { $in: myInterest.interestedCategories },
      status: { $eq: "approve" },
    })
      .limit(limit)
      .skip(randomSkip)
      .sort("-createdAt");
  }

  return data;
};

const deleteAdvertise = async (id: ObjectId) => {
  const result = await Advertise.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );

  return result;
};

const approveAddsByAdmin = async (reviewID: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const adds: any = await Advertise.findById(reviewID)
      .populate({
        path: "categoryId",
        select: "name",
      })
      .session(session);

    if (!adds) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Advertise/offer does not exist!"
      );
    }

    if (adds?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "Ads/offer was deleted!");
    }

    if (adds?.status === "approve") {
      throw new AppError(httpStatus.FORBIDDEN, "Ads/offer already approved!");
    }

    if (adds?.status === "reject") {
      throw new AppError(httpStatus.FORBIDDEN, "Ads/offer already rejected!");
    }

    const isMyCat = await ServiceCat.findById(adds?.categoryId?._id).session(
      session
    );

    if (
      isMyCat?.status !== "active" &&
      isMyCat?.creator instanceof Types.ObjectId &&
      isMyCat?.creator.equals(adds.creator)
    ) {
      const res = await ServiceCat.findByIdAndUpdate(
        adds?.categoryId?._id,
        { status: "active" },
        { new: true }
      ).session(session);
      console.log(res);
    }

    const updatedAd = await Advertise.findByIdAndUpdate(
      reviewID,
      { status: "approve" },
      { new: true }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    return updatedAd;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const rejectAddsByAdmin = async (reviewID: string) => {
  const adds: any = await Advertise.findById(reviewID);
  if (!adds) {
    throw new AppError(httpStatus.NOT_FOUND, "Advertise/offer does not exist!");
  }

  if (adds?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Ads/offer was deleted!");
  }
  if (adds?.status === "approve") {
    throw new AppError(httpStatus.FORBIDDEN, "Ads/offer already approved!");
  }
  if (adds?.status === "reject") {
    throw new AppError(httpStatus.FORBIDDEN, "Ads/offer already rejected!");
  }

  return await Advertise.findByIdAndUpdate(
    reviewID,
    { status: "reject" },
    { new: true }
  );
};

export const advertiseService = {
  createAdvertise,
  getAdvertise,
  getMyAdvertise,
  deleteAdvertise,
  approveAddsByAdmin,
  rejectAddsByAdmin,
};
