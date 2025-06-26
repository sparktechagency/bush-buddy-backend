/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { accountDetailsServices } from "./accountDetails.service";

const getUserInfo = catchAsync(async (req, res) => {
  const result = await accountDetailsServices.getUserInfo(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User info retrieved successful!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await accountDetailsServices.deleteUser(req.params.id as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successful!",
    data: result,
  });
});

export const accountDetailsController = {
  getUserInfo,
  deleteUser,
};
