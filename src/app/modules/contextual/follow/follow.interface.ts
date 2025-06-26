import { ObjectId } from "mongoose";

export interface IFollow {
  id: string;
  userId: ObjectId; // The user who is following
  followedUserId: ObjectId; // The user being followed
  isFollowing?: boolean;
}
