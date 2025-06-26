/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
// import { Food } from "../foods/foods.model";
import moment from "moment";
import mongoose, { ObjectId, PipelineStage, startSession } from "mongoose";
import cron from "node-cron";
import { User } from "../../base/user/user.model";

import {
  getEndOfDayPlusOne,
  getStartOfDay,
} from "../../../common/utils/dateConverter";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { IReview } from "./review.interface";
import { Review } from "./review.model";

const createReview = async (payload: IReview) => {
  // Check if users exist (Seller and Buyer)
  await User.isUserExistById(payload.seller);
  await User.isUserExistById(payload.buyer);

  // Calculate total rating out of 20 (4 categories * max rating of 5)
  const totalRating =
    payload.professionalism +
    payload.timelines +
    payload.qualityOfService +
    payload.cleanliness;

  const maxPossibleRating = 5 * 4;
  const totalReview = (totalRating / maxPossibleRating) * 5; // Scale to 1-5 range

  // Fetch seller details
  const seller = await User.findOne(payload.seller);

  if (!seller) {
    throw new AppError(httpStatus.FORBIDDEN, "Seller does not exist!");
  }

  // Current values from the seller's ratings
  // const currentValueForMoneyAvg = seller?.valueForMoney?.avgPercentage || 0;
  // const currentValueForMoneyTotal = seller?.valueForMoney?.total || 0;
  // const currentValueForMoneyYes = seller?.valueForMoney?.yes || 0;
  // const currentValueForMoneyNo = seller?.valueForMoney?.no || 0;

  // Calculate my review score
  const sellerStar = seller?.ratings?.star ?? 0;
  const myReview =
    sellerStar === 0 ? totalReview : (sellerStar + totalReview) / 2;

  // Pipeline for aggregating reviews
  const pipeline: PipelineStage[] = [
    { $match: { seller: new mongoose.Types.ObjectId(payload.seller as any) } },
    {
      $group: {
        _id: null,
        totalRatings: { $sum: "$ratings" },
        totalUser: { $sum: 1 },
      },
    },
  ];

  // Aggregate the data
  const result = await Review.aggregate(pipeline);

  // Prepare the review payload
  const reviewPayload = {
    "ratings.totalReview": result[0]?.totalRating,
    "ratings.totalUser": result[0]?.totalUser,
    "ratings.star": myReview.toFixed(1),
  };

  payload.ratings = Number(totalReview.toFixed(1));

  // Start a transaction
  const session = await startSession();
  session.startTransaction();

  try {
    // Transaction 1: Create the Review
    const [newReview] = await Review.create([payload], { session });

    // Transaction 2: Update Seller's Ratings
    await User.findByIdAndUpdate(payload.seller, reviewPayload, {
      session,
    });

    // Dynamic calculation for valueForMoney

    await session.commitTransaction();

    return newReview; // Return the newly created review
  } catch (error: any) {
    // Abort transaction on error
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || "Failed to create review"
    );
  } finally {
    // End the session after the transaction is complete
    await session.endSession();
  }
};

const getReviewBySellerAndBuyer = async (sellerId: ObjectId) => {
  // Convert to ObjectId
  // const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  const seller = await User.isUserExistById(sellerId);

  if (seller.role !== USER_ROLE.USER)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "The params id is not a seller id!"
    );

  const result = await Review.find({
    seller: { $eq: sellerId },
    status: { $ne: "disputed" },
    isDeleted: { $eq: false },
  }).populate("buyer");

  return result;
};

const getReviewByBuyer = async (
  buyerId: ObjectId,
  query: Record<string, unknown>
) => {
  const monthInput = query.month as string | undefined;

  // Step 1: Build base filter
  const filter: Record<string, any> = {
    buyer: { $eq: buyerId },
    status: { $ne: "disputed" },
    isDeleted: false,
  };

  // Step 2: If any valid date is passed, extract month and year
  if (monthInput) {
    const parsedDate = new Date(monthInput);
    if (!isNaN(parsedDate.getTime())) {
      const year = parsedDate.getUTCFullYear(); // Ensure UTC year
      const month = parsedDate.getUTCMonth(); // Ensure UTC month (0-indexed)

      // Set the start and end to UTC
      const start = new Date(Date.UTC(year, month, 1)); // First day of the month in UTC
      const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // Last day of the month in UTC

      filter.createdAt = { $gte: start, $lte: end };

      console.log("Month filter", {
        $gte: start.toISOString(),
        $lte: end.toISOString(),
      });
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format");
    }
  }

  console.log("🚀 ~ filter:", filter);

  // return await Review.find(filter).populate("buyer");

  // Step 3: Query with pagination
  const reviewQuery = new QueryBuilder(
    Review.find(filter).populate("buyer"),
    query
  )
    .fields()
    .paginate()
    .sort();

  const meta = await reviewQuery.countTotal();
  const data = await reviewQuery.modelQuery;

  return { meta, data };
};

const getPrivateFeedback = async (sellerId: ObjectId) => {
  const feedbacks = await Review.find(
    {
      seller: sellerId,
      isDeleted: false,
      privateFeedback: { $ne: "" },
    },
    { privateFeedback: 1, createdAt: 1, _id: 0 }
  );
  return feedbacks;
};

const acceptReview = async (reviewId: ObjectId) => {
  const isReview = await Review.findById(reviewId);

  if (!isReview) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found!");
  }
  if (isReview.status === "disputed") {
    throw new AppError(httpStatus.BAD_REQUEST, "Review was disputed!");
  }
  const result = await Review.findByIdAndUpdate(
    reviewId,
    { status: "accepted" },
    { new: true }
  );

  return result;
};

// ? CORN auto update
const autoAcceptReview = async () => {
  // Cron job to run every hour (adjust as necessary)
  cron.schedule("0 * * * *", async () => {
    try {
      // Get current time
      const currentTime = moment();

      // Find reviews created more than 48 hours ago and with 'not-accepted' status
      await Review.updateMany(
        {
          status: "pending",
          createdAt: { $lt: currentTime.subtract(48, "hours").toDate() },
        },
        {
          status: "accepted",
          updatedAt: new Date(),
        }
      );
    } catch (error) {
      console.error("Error updating reviews:", error);
    }
  });
};

const getTips = async (sellerId: ObjectId) => {
  const result = await Review.find({ seller: sellerId });

  return result;
};

const getYourBuyerReview = async (query: Record<string, unknown>) => {
  await User.isUserExistById(query.user as any);

  const { startDate: rawStartDate, endDate: rawEndDate, limit = 10 } = query;

  const startDateRaw = rawStartDate ? new Date(rawStartDate as string) : null;
  const endDateRaw = rawEndDate ? new Date(rawEndDate as string) : null;

  const startDate = startDateRaw ? getStartOfDay(startDateRaw) : null;
  const endDate = endDateRaw ? getEndOfDayPlusOne(endDateRaw) : null;
  console.log("🚀 ~ getYourBuyerReview ~ endDate:", startDate, endDate);

  const pipeline: PipelineStage[] = [];

  const matchCondition: any = {};

  pipeline.push({
    $match: {
      buyer: { $eq: new mongoose.Types.ObjectId(query.user as string) },
    },
  });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "seller",
      foreignField: "_id",
      as: "sellerInfo",
      pipeline: [
        {
          $project: {
            firstName: 1,
            profileImage: 1,
            surName: 1,
          },
        },
      ],
    },
  });

  if (startDate && !isNaN(startDate.getTime())) {
    matchCondition.$gte = startDate;
  }

  if (endDate && !isNaN(endDate.getTime())) {
    matchCondition.$lt = endDate;
  }
  if (Object.keys(matchCondition).length > 0) {
    console.log(matchCondition);
    pipeline.push({
      $match: {
        createdAt: matchCondition,
      },
    });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  pipeline.push({ $limit: Number(limit) as number });

  const result = await Review.aggregate(pipeline);

  return result;
};

export const ReviewService = {
  createReview,
  getReviewBySeller: getReviewBySellerAndBuyer,
  getPrivateFeedback,
  getTips,
  getYourBuyerReview,
  acceptReview,
  autoAcceptReview,
  getReviewByBuyer,
};
