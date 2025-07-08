import { ObjectId } from "mongoose";

export interface ISos {
  user: ObjectId;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
}
