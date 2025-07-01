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

const getHunt = catchAsync(async (req, res) => {
  const result = await hunt_service.getHunt(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hunt post retrieve successful!",
    data: result,
  });
});

export const hunt_controller = {
  createHunt,
  getHunt,
};
