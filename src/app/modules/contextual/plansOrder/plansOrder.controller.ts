import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { plansOrderService } from "./plansOrder.service";

const createOrder = catchAsync(async (req, res) => {
  const result = await plansOrderService.createOrder(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order created successfully",
    data: result,
  });
});

export const plansOrderController = {
  createOrder,
};
