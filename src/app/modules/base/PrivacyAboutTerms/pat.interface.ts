import { ObjectId } from "mongoose";

export interface IPat {
  body: string;
  type: "privacy-policy" | "terms-condition" | "about-us";
  modifiedBy: ObjectId;
}
