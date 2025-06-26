import { ObjectId } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  owner: ObjectId;
  price: number;
  category: ObjectId;
  stock: number;
  images: string[];
  featureImage: string;

  brand: string;
  color: string;
  condition: string;

  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  status: "active" | "inactive";
  isDeleted: boolean;
}
