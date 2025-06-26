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

export const subscriptionsController = {
  createSubscription,
};
