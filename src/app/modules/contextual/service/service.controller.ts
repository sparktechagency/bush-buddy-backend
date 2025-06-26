/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { Service_service } from "./service.service";

const createService = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.owner = req.user.id;

  const result = await Service_service.createService(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.owner = req.user._id;

  const result = await Service_service.updateService(
    req.params.id as any,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

const getServices = catchAsync(async (req, res) => {
  const result = await Service_service.getService(
    req.user.id,
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieve successfully",
    data: result,
  });
});

const getSingleServices = catchAsync(async (req, res) => {
  const result = await Service_service.getSingleService(req.params.id as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single  service retrieve successfully",
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const result = await Service_service.deleteService(req.params.id as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

export const service_controller = {
  createService,
  updateService,
  getServices,
  getSingleServices,
  deleteService,
};
