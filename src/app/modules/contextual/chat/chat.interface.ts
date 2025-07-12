import { ObjectId } from "mongoose";

export interface IChat {
  _id: string;
  content: string;
  sender: ObjectId;
  receiver: ObjectId;
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
