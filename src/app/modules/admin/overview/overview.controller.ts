/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { overviewService } from "./overview.service";

const getUserChart = catchAsync(async (req, res) => {
  const result = await overviewService.getUserChart(req.query.year as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User chart retrieved successful!",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const result = await overviewService.updateAdmin(
    req.user.id as any,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin updated successful!",
    data: result,
  });
});

const totalEarnings = catchAsync(async (req, res) => {
  const result = await overviewService.getEarnings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Total earning retrieve successful!",
    data: result,
  });
});

export const overviewController = { getUserChart, updateAdmin, totalEarnings };
