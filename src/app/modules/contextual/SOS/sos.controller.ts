/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { sos_service } from "./sos.service";

const createSos = catchAsync(async (req, res) => {
  req.body.user = req.user.id;
  const result = await sos_service.createSos(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sos created successful!",
    data: result,
  });
});

const getSos = catchAsync(async (req, res) => {
  const result = await sos_service.getSos();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sos retrieve successful!",
    data: result,
  });
});

const getMySos = catchAsync(async (req, res) => {
  const result = await sos_service.getMySos(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sos retrieve successful!",
    data: result,
  });
});

const updateSos = catchAsync(async (req, res) => {
  const result = await sos_service.updateSos(req.params.id as any, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sos updated successful!",
    data: result,
  });
});

const deactivateSos = catchAsync(async (req, res) => {
  const result = await sos_service.deactivateSos(req.params.id as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sos deactivated successful!",
    data: result,
  });
});

export const sos_controller = {
  createSos,
  getSos,
  getMySos,
  updateSos,
  deactivateSos,
};
