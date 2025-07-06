/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { subscriptionsService } from "./subscriptions.service";

const createSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionsService.createSubscription(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription created successfully!!",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionsService.updateSubscription(
    req.params.id as any,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription created successfully!!",
    data: result,
  });
});

const getSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionsService.getSubscription();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription retrieve successfully!!",
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionsService.deleteSubscription(
    req.params.id as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription deleted successfully!!",
    data: result,
  });
});

const paymentASubscription = catchAsync(async (req, res) => {
  const result = await subscriptionsService.paymentASubscription(
    req.params.subId as any,
    req.user.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment link created successfully",
    data: result,
  });
});

const paymentSuccessStripe = catchAsync(async (req, res) => {
  const result = await subscriptionsService.paymentSuccessStripe(
    req.query as any
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment link created successfully",
    data: result,
  });
});

// const paymentCancelStripe = catchAsync(async (req, res) => {
//   const result = await subscriptionsService.paymentSuccessStripe(
//     req.query as any
//   );
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Payment link created successfully",
//     data: result,
//   });
// });

export const subscriptionsController = {
  createSubscription,
  updateSubscription,
  getSubscription,
  deleteSubscription,
  paymentASubscription,
  paymentSuccessStripe,
  // paymentCancelStripe,
};
