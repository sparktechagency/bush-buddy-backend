/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import AppError from "../../../core/error/AppError";
import { User } from "../user/user.model";
import Notification from "./notification.model";
import { notificationServices } from "./notification.service";

const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  query["receiver"] = req.user.id;
  const result = await notificationServices.getNotificationFromDb(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const makeRead = catchAsync(async (req: Request, res: Response) => {
  await User.isUserExistById(req.user.id);
  const { query } = req;
  query.user = req.user.id;
  if (!query.notId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Notification id must be provided in query url!"
    );
  }

  const isNotification = await Notification.findOne({
    _id: query.notId,
    receiver: req.user.id,
  });

  if (!isNotification) {
    throw new AppError(httpStatus.NOT_FOUND, "Notification is not exist!");
  }

  const result = await notificationServices.makeMeRead(query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications read successfully",
    data: result,
  });
});

const makeAllNotRead = catchAsync(async (req: Request, res: Response) => {
  await User.isUserExistById(req.user.id);
  const { query } = req;
  query.user = req.user.id;

  const result = await notificationServices.makeAllNotRead(query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All notifications read successfully",
    data: result,
  });
});

export const notificationController = {
  getAllNotification,
  makeRead,
  makeAllNotRead,
};
