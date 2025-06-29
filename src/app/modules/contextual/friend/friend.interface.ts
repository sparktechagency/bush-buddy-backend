import { ObjectId } from "mongoose";

export interface IFriend {
  id: string;
  userId: ObjectId;
  friendId: ObjectId;
  status: "active" | "block";
}
