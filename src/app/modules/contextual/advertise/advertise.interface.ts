import { Document, ObjectId } from "mongoose";

export interface IAdvertise extends Document {
  creator: ObjectId;
  categoryId?: ObjectId;
  photos: string[];
  description: string;
  discount: number;

  startDate: string;
  endDate: string;

  status: "pending" | "approve" | "reject";
  isDeleted: boolean;
}
 