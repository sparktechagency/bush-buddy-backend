import { ObjectId } from "mongoose";

export interface IService {
  name: string;
  category: ObjectId;
  description: string;
  owner: ObjectId;
  price: number;
  phone: string;
  images: string[];
  featureImage: string;

  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  status: "active" | "inactive";
  isDeleted: boolean;
}
