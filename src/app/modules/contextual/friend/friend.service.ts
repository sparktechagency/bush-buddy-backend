import httpStatus from "http-status";
import AppError from "../../../core/error/AppError";
import { User } from "../../base/user/user.model";
import { IFriend } from "./friend.interface";
import { Friend } from "./friend.model";

export const createFriend = async (payload: IFriend) => {
  const { userId, friendId } = payload;

  if (userId === friendId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot friend yourself");
  }

  const isTargetUserExist = await User.exists({ _id: friendId });
  if (!isTargetUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Target user does not exist");
  }

  const isAlreadyFriend = await Friend.exists({ userId, friendId });
  if (isAlreadyFriend) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already friending this user"
    );
  }

  // Optional: Handle mutual friend logic here
  const newFriend = await Friend.create(payload);
  return newFriend;
};

// const getMyFriends = async (myId: string) => {
//   const Friends = await Friend.find({ friendId: myId })
//     .populate("userId", "name email profileImage")
//     .lean();

//   return Friends;
// };

const getMyFriends = async (myId: string) => {
  const Friending = await Friend.find({ userId: myId })
    .populate("friendId", "name email profileImage")
    .lean();

  return Friending;
};

const deleteFriend = async (userId: string, friendId: string) => {
  const isFriendExist = await Friend.findOne({ userId, friendId });

  if (!isFriendExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Param id maybe wrong, friend not found"
    );
  }

  const result = await Friend.findOneAndDelete({ userId, friendId });

  return {
    message: "Successfully unFriended the user",
    data: result,
  };
};

export const friend_service = {
  createFriend,
  getMyFriends,
  // getMyFriending,
  deleteFriend,
};
