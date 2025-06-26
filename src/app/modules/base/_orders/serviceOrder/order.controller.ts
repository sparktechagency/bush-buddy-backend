/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { order_service } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  req.body.user = req.user.id;

  const result = await order_service.createOrder(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "",
    data: result,
  });
});

// ✅ Get All Orders
const getAllOrders = catchAsync(async (req, res) => {
  const result = await order_service.getOrders(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully!",
    data: result,
  });
});

// ✅ Get Single Order
const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await order_service.getSingleOrder(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully!",
    data: result,
  });
});

// ✅ Update Order
const updateOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await order_service.updateOrder(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order updated successfully!",
    data: result,
  });
});

// ✅ Delete Order
const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await order_service.deleteOrder(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order deleted successfully!",
    data: result,
  });
});

export const order_controller = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
