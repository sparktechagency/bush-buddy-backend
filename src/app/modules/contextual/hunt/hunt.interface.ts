import { ObjectId } from "mongoose";

export interface IHunt {
  title: string;
  description: string;
  image: string;
  author: ObjectId;
  status: "approved" | "pending";
  location: {
    type: string;
    coordinates: number[];
  };
  isDeleted: boolean;
}
