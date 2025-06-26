/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { advertiseService } from "./advertise.service";

const createAdvertise = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.creator = req.user.id;
  const result = await advertiseService.createAdvertise(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Advertise created successful!",
    data: result,
  });
});

const getAdvertise = catchAsync(async (req, res) => {
  const result = await advertiseService.getAdvertise(req.query as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Advertise retrieved successful!",
    data: result,
  });
});

const getMyAdvertise = catchAsync(async (req, res) => {
  const result = await advertiseService.getMyAdvertise(
    req.user.id,
    req.query.limit as any
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Advertise retrieved successful!",
    data: result,
  });
});

const deleteAdvertise = catchAsync(async (req, res) => {
  const result = await advertiseService.deleteAdvertise(req.params.id as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Advertise delete successful!",
    data: result,
  });
});

const approveAddsByAdmin = catchAsync(async (req, res) => {
  const result = await advertiseService.approveAddsByAdmin(
    req.params.id as any
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Advertise approved successful!",
    data: result,
  });
});

const rejectAddsByAdmin = catchAsync(async (req, res) => {
  const result = await advertiseService.rejectAddsByAdmin(req.params.id as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Advertise rejected successful!",
    data: result,
  });
});

export const advertiseController = {
  createAdvertise,
  getAdvertise,
  getMyAdvertise,
  deleteAdvertise,
  approveAddsByAdmin,
  rejectAddsByAdmin,
};
