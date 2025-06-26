/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { support_service } from "./support.service";

const createSupport = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.user = req.user.id;

  const result = await support_service.createSupport(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Support message send to email successful!!",
    data: result,
  });
});

export const support_controller = {
  createSupport,
};
