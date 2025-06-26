import { ObjectId } from "mongoose";
// Define the interface for the Dispute schema

export interface IReview extends Document {
  buyer: ObjectId;
  seller: ObjectId;
  professionalism: number;
  timelines: number;
  qualityOfService: number;
  cleanliness: number;
  ratings?: number;
  comments: string;
  valueForMoney: "yes" | "no" | "";
  photo: string;

  status: "accepted" | "disputed" | "pending";
  isDeleted?: boolean;
}
