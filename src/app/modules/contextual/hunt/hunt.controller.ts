/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { hunt_service } from "./hunt.service";

const createHunt = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.author = req.user.id;

  const result = await hunt_service.createHunt(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hunt post created successful!",
    data: result,
  });
});

const getMyHunt = catchAsync(async (req, res) => {
  const result = await hunt_service.getMyHunt(req.user.id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Hunt post retrieve successful!",
    data: result,
  });
});

const getHunt = catchAsync(async (req, res) => {
  const result = await hunt_service.getHunt(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hunt post retrieve successful!",
    data: result,
  });
});

const updateHunt = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.author = req.user.id;

  const result = await hunt_service.updateHunt(req.params.id as any, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hunt post updated successful!",
    data: result,
  });
});

const deleteMyHunt = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.author = req.user.id;

  const result = await hunt_service.deleteMyHunt(
    req.params.id as any,
    req.user.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hunt post deleted successful!",
    data: result,
  });
});

const getWeather = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.author = req.user.id;

  const result = await hunt_service.getWeather(req.query as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wether retrieve successful!",
    data: result,
  });
});

export const hunt_controller = {
  createHunt,
  getMyHunt,
  getHunt,
  updateHunt,
  deleteMyHunt,
  getWeather,
};
