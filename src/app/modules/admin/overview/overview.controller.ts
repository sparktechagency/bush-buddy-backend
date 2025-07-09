/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { overviewService } from "./overview.service";

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

const userOverview = catchAsync(async (req, res) => {
  const result = await overviewService.userOverview(req.query.year as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Total user overview retrieve successful!",
    data: result,
  });
});

const getIncomeSummary = catchAsync(async (req, res) => {
  const result = await overviewService.getIncomeSummary(req.query as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Income summery retrieved successful!",
    data: result,
  });
});

export const overviewController = {
  getIncomeSummary,
  updateAdmin,
  userOverview,
};
