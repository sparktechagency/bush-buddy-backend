import { ObjectId } from "mongoose";

export interface ISupport {
  user: ObjectId;
  subject: string;
  description: string;
  isDeleted: boolean;
}
