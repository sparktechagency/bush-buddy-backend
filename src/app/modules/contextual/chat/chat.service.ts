/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import AppError from "../../../core/error/AppError";
import { Chat } from "./chat.model";

const getChat = async (payload: { myId: ObjectId; partnerId: ObjectId }) => {
  if (!payload.partnerId) {
    throw new AppError(httpStatus.NOT_FOUND, "Partner ID is required");
  }

  return await Chat.find({
    $and: [
      {
        $or: [
          { sender: payload.myId, receiver: payload.partnerId },
          { sender: payload.partnerId, receiver: payload.myId },
        ],
      },
      { isShow: true },
    ],
  })
    .sort({ createdAt: 1 })
    .populate({
      path: "sender",
      select: "firstName surName email profileImage isOnline",
    })
    .populate({
      path: "receiver",
      select: "firstName surName email profileImage isOnline",
    });
};

const getMyPartners = async (myId: string) => {
  const myObjectId = new mongoose.Types.ObjectId(myId);

  return await Chat.aggregate([
    {
      $match: {
        $or: [{ sender: myObjectId }, { receiver: myObjectId }],
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $project: {
        userId: {
          $cond: [{ $eq: ["$sender", myObjectId] }, "$receiver", "$sender"],
        },
        isSenderRead: 1,
        isReceiverRead: 1,
        content: 1,
        images: 1,
        isImage: 1,
        chatTime: 1,
        sender: 1,
        receiver: 1,
      },
    },
    {
      $group: {
        _id: "$userId",
        isSenderRead: { $first: "$isSenderRead" },
        isReceiverRead: { $first: "$isReceiverRead" },
        lastMessage: {
          $first: {
            content: "$content",
            images: "$images",
            isImage: "$isImage",
            chatTime: "$chatTime",
            sender: "$sender",
            receiver: "$receiver",
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "friends",
        let: { userId: "$user._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$friendId", "$$userId"] },
                  { $eq: ["$userId", myObjectId] },
                ],
              },
            },
          },
        ],
        as: "isMyFriendCheck",
      },
    },
    {
      $addFields: {
        isFriend: { $gt: [{ $size: "$isMyFriendCheck" }, 0] },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$user",
            {
              isFriend: "$isFriend",
              isSenderRead: "$isSenderRead",
              isReceiverRead: "$isReceiverRead",
              lastMessage: "$lastMessage",
            },
          ],
        },
      },
    },
    {
      $project: {
        name: 1,
        userName: 1,
        email: 1,
        profileImage: 1,
        locationName: 1,
        isOnline: 1,
        isFriend: 1,
        isSenderRead: 1,
        isReceiverRead: 1,
        lastMessage: 1,
      },
    },
  ]);
};

const sendImages = async (payload: any) => {
  const newChat = new Chat({
    sender: payload.myId,
    receiver: payload.body.partnerId,
    images: payload.body.images,
    content: payload.body.content || "",
    isImage: true,
    isShow: false,
    isRead: false,
    chatTime: new Date(),
  });

  return await Chat.create(newChat);
};

const getAllChat = async () => {
  return await Chat.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "sender",
    })
    .populate({
      path: "receiver",
    });
};

export const chatService = {
  getChat,
  getAllChat,
  sendImages,
  getMyPartners,
};
