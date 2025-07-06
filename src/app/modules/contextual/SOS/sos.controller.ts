/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { sos_service } from "./sos.service";

const createSos = catchAsync(async (req, res) => {
  const result = await sos_service.createSos(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sos created successful!",
    data: result,
  });
});

export const sos_controller = {
  createSos,
};
