/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { friend_service } from "./friend.service";

// ✅ Create friend
const createFriend = catchAsync(async (req, res) => {
  req.body.userId = req.user.id;

  const result = await friend_service.createFriend(req.body as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "friend created successfully",
    data: result,
  });
});

// ✅ Get My friends
const getMyFriends = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await friend_service.getMyFriends(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "friends retrieved successfully",
    data: result,
  });
});

// ✅ Get My friending
// const getMyFriend = catchAsync(async (req, res) => {
//   const userId = req.user.id;

//   const result = await friend_service.getMyFriends(userId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "friending retrieved successfully",
//     data: result,
//   });
// });

// ✅ Delete friend (Unfriend someone)
const deletefriend = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const friendedUserId = req.params.id;

  const result = await friend_service.deleteFriend(userId, friendedUserId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully unfriended",
    data: result,
  });
});

export const friend_controller = {
  createFriend,
  getMyFriends,
  // getMyFriend,
  deletefriend,
};
