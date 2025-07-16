import mongoose from "mongoose";

export interface IChat {
  _id: mongoose.Types.ObjectId;
  content: string;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  images: string[];
  location: {
    type: string;
    coordinates: number[];
  };
  isImage: boolean;
  isSenderRead: boolean;
  isReceiverRead: boolean;
  isShow: boolean;
  chatTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
