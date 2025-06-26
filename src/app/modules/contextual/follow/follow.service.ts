import httpStatus from "http-status";
import AppError from "../../../core/error/AppError";
import { User } from "../../base/user/user.model";
import { IFollow } from "./follow.interface";
import { Follow } from "./follow.model";

const createFollow = async (payload: IFollow) => {
  const { userId, followedUserId } = payload;

  // Prevent following self
  if (userId === followedUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot follow yourself");
  }

  // Check if target user exists
  const isTargetUserExist = await User.exists({ _id: followedUserId });
  if (!isTargetUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Target user does not exist");
  }

  // Check if already following
  const isFollowExist = await Follow.exists({ userId, followedUserId });
  if (isFollowExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already following this user");
  }

  // Check if the other user follows back
  const isHeFollowingMe = await Follow.exists({
    userId: followedUserId,
    followedUserId: userId,
  });

  const newFollowData: IFollow = {
    ...payload,
    isFollowing: !!isHeFollowingMe,
  };

  const result = await Follow.create(newFollowData);
  return result;
};

const getMyFollowers = async (myId: string) => {
  const followers = await Follow.find({ followedUserId: myId })
    .populate("userId", "name email profileImage")
    .lean();

  return followers;
};

const getMyFollowing = async (myId: string) => {
  const following = await Follow.find({ userId: myId })
    .populate("followedUserId", "name email profileImage")
    .lean();

  return following;
};

const deleteFollow = async (userId: string, followedUserId: string) => {
  const isFollowExist = await Follow.findOne({ userId, followedUserId });

  if (!isFollowExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Follow relation not found");
  }

  const result = await Follow.findOneAndDelete({ userId, followedUserId });

  return {
    message: "Successfully unfollowed the user",
    data: result,
  };
};

export const follow_service = {
  createFollow,
  getMyFollowers,
  getMyFollowing,
  deleteFollow,
};
