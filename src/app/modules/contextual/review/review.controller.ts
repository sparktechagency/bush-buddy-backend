/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId } from "mongoose";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  req.body.buyer = req.user.id;

  const result = await ReviewService.createReview(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review created successfully",
    data: result,
  });
});

const getReviewBySellerId = catchAsync(async (req, res) => {
  const result = await ReviewService.getReviewBySeller(req.params.id as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const getReviewByBuyerId = catchAsync(async (req, res) => {
  const result = await ReviewService.getReviewByBuyer(req.user.id, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const getPrivateFeedback = catchAsync(async (req, res) => {
  const result = await ReviewService.getPrivateFeedback(req.user.id as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const getTips = catchAsync(async (req, res) => {
  const result = await ReviewService.getTips(req.user.id as ObjectId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tips retrieved successfully",
    data: result,
  });
});

const getYourBuyerReview = catchAsync(async (req, res) => {
  const query = req.query;
  console.log("🚀 ~ getYourBuyerReview ~ query:", query);
  query.user = req.user.id;
  const result = await ReviewService.getYourBuyerReview(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const acceptReview = catchAsync(async (req, res) => {
  const result = await ReviewService.acceptReview(req.params.reviewId as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review accepted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReviewBySellerId,
  getPrivateFeedback,
  getTips,
  getYourBuyerReview,
  acceptReview,
  getReviewByBuyerId,
};
