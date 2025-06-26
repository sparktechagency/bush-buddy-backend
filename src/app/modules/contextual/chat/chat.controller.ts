/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { chatService } from "./chat.service";

const getMyChat = catchAsync(async (req, res) => {
  const myId = req.user.id;
  const partnerId: ObjectId | any = req.query.partnerId;

  const result = await chatService.getChat({ myId, partnerId });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Message retrieved successful!",
    data: result,
  });
});

const getMyPartners = catchAsync(async (req, res) => {
  const myId = req.user.id;

  const result = await chatService.getMyPartners(myId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Partners retrieved successful!",
    data: result,
  });
});

const sendImages = catchAsync(async (req, res) => {
  const myId = req.user.id;

  const result = await chatService.sendImages({ myId, body: req.body });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Images add successful!",
    data: result,
  });
});

export const chatController = {
  getMyPartners,
  getMyChat,
  sendImages,
};
