/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { WishList_service } from "./wishlist.service";

const createWishList = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.user = req.user.id;

  const result = await WishList_service.createWishList(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "WishList created successful",
    data: result,
  });
});

const getMyWishList = catchAsync(async (req, res) => {
  const { query } = req;
  query.user = req.user.id;

  const result = await WishList_service.getMyWishList(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "WishList get successful",
    data: result,
  });
});

const deleteWishList = catchAsync(async (req, res) => {
  const { query } = req;
  query.user = req.user.id;

  const result = await WishList_service.deleteWishList(req.params.id as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "WishList delete successful",
    data: result,
  });
});

export const WishList_controller = {
  createWishList,
  getMyWishList,
  deleteWishList,
};
