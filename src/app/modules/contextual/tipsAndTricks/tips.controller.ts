/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { tips_service } from "./tips.service";

const createTips = catchAsync(async (req, res) => {
  const result = await tips_service.createTips(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tips created successful!",
    data: result,
  });
});

const getTips = catchAsync(async (req, res) => {
  const result = await tips_service.getTips(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tips retrieve successful!",
    data: result,
  });
});

export const tips_controller = {
  createTips,
  getTips,
};
