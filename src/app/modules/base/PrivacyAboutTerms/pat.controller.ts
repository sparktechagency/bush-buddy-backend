import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { patService } from "./pat.service";

const createPrivacy = catchAsync(async (req, res) => {
  const result = await patService.createPrivacy(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Privacy created successfully",
    data: result,
  });
});
const createAbout = catchAsync(async (req, res) => {
  const result = await patService.createAbout(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "About created successfully",
    data: result,
  });
});
const createTerms = catchAsync(async (req, res) => {
  const result = await patService.createTerms(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Terms created successfully",
    data: result,
  });
});
const getPrivacy = catchAsync(async (req, res) => {
  const result = await patService.getPrivacy();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Privacy retrieved successfully",
    data: result,
  });
});
const getAbout = catchAsync(async (req, res) => {
  const result = await patService.getAbout();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "About retrieved successfully",
    data: result,
  });
});
const getTerms = catchAsync(async (req, res) => {
  const result = await patService.getTerms();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Terms retrieved successfully",
    data: result,
  });
});

export const patController = {
  createPrivacy,
  createAbout,
  createTerms,
  getPrivacy,
  getAbout,
  getTerms,
};
