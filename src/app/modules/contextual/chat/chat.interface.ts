import { ObjectId } from "mongoose";

export interface IChat {
  _id: string;
  content: string;
  sender: ObjectId;
  receiver: ObjectId;
  images: string[];
  isImage: boolean;
  isRead: boolean;
  isShow: boolean;
  chatTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
