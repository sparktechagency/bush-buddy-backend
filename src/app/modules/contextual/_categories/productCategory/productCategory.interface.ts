import { ObjectId } from "mongoose";

export interface IProductCategory {
  name: string;
  image: string;
  creator: ObjectId;
  description?: string;
  parent: {
    isParent: boolean;
    parentCatId: ObjectId;
  };
  status: "active" | "inactive";
  isDeleted?: boolean;
}
