/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { product_service } from "./product.service";

const createProduct = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.owner = req.user.id;

  const result = await product_service.createProduct(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.owner = req.user._id;

  const result = await product_service.updateProduct(
    req.params.id as any,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getProducts = catchAsync(async (req, res) => {
  const result = await product_service.getProduct(
    req.user.id,
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieve successfully",
    data: result,
  });
});

const getSingleProducts = catchAsync(async (req, res) => {
  const result = await product_service.getSingleProduct(req.params.id as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single product retrieve successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await product_service.deleteProduct(req.params.id as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

export const product_controller = {
  createProduct,
  updateProduct,
  getProducts,
  getSingleProducts,
  deleteProduct,
};
