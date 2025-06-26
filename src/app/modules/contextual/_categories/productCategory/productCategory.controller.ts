/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { categoryService } from "./productCategory.service";

const createCat = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req?.user?.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category created successfully",
    data: result,
  });
});

const updateCat = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(
    req?.params.catId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "category updated successfully",
    data: result,
  });
});

const getCat = catchAsync(async (req, res) => {
  const result = await categoryService.getCategory(req?.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrieved category successfully",
    data: result,
  });
});

const deleteCat = catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategory(
    req?.params?.catId as any
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "delete category successfully",
    data: result,
  });
});

export const categoryController = {
  createCat,
  updateCat,
  getCat,
  deleteCat,
};
