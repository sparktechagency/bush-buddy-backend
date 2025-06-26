/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import AppError from "../../../core/error/AppError";
import { Chat } from "./chat.model";

const getChat = async (payload: { myId: ObjectId; partnerId: ObjectId }) => {
  if (!payload.partnerId) {
    throw new AppError(httpStatus.NOT_FOUND, "Partner ID is required");
  }

  const result = await Chat.find({
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
    .sort({ createdAt: -1 })
    .populate({
      path: "sender",
      select: "firstName surName email profileImage isOnline",
    })
    .populate({
      path: "receiver",
      select: "firstName surName email profileImage isOnline",
    });

  return result;
};

const getMyPartners = async (myId: ObjectId) => {
  const partners = await Chat.aggregate([
    { $match: { sender: new mongoose.Types.ObjectId(myId as any) } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$receiver",
        latestChat: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "receiverData",
      },
    },
    {
      $unwind: "$receiverData",
    },
    {
      $project: {
        _id: 0,
        receiver: "$receiverData._id",
        firstName: "$receiverData.firstName",
        surName: "$receiverData.surName",
        email: "$receiverData.email",
        profileImage: "$receiverData.profileImage",
        isOnline: "$receiverData.isOnline",
        createdAt: "$latestChat.createdAt",
        updatedAt: "$latestChat.updatedAt",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return partners;
};

const sendImages = async (payload: any) => {
  console.log("🚀 ~ sendImages ~ payload:", payload);

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

  const result = await Chat.create(newChat);

  return result;
};

const getAllChat = async () => {
  const result = await Chat.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "sender",
    })
    .populate({
      path: "receiver",
    });

  return result;
};

export const chatService = {
  getChat,
  getAllChat,
  sendImages,
  getMyPartners,
};
