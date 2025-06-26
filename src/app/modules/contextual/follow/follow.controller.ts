/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { follow_service } from "./follow.service";

// ✅ Create Follow
const createFollow = catchAsync(async (req, res) => {
  req.body.userId = req.user.id;

  const result = await follow_service.createFollow(req.body as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow created successfully",
    data: result,
  });
});

// ✅ Get My Followers
const getMyFollowers = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await follow_service.getMyFollowers(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Followers retrieved successfully",
    data: result,
  });
});

// ✅ Get My Following
const getMyFollowing = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await follow_service.getMyFollowing(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Following retrieved successfully",
    data: result,
  });
});

// ✅ Delete Follow (Unfollow someone)
const deleteFollow = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const followedUserId = req.params.id;

  const result = await follow_service.deleteFollow(userId, followedUserId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully unfollowed",
    data: result,
  });
});

export const follow_controller = {
  createFollow,
  getMyFollowers,
  getMyFollowing,
  deleteFollow,
};
