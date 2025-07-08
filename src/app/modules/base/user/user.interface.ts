/* eslint-disable no-unused-vars */
import { Model, ObjectId } from "mongoose";
import { USER_ROLE } from "../../../core/constants/global.constants";

export interface IUserVerification {
  verified: boolean;
  plans?: ObjectId;
  plansType?: "basic" | "advanced";
  otp?: string;
}

export interface IPayment {
  status: "paid" | "not-paid" | "expired" | "free";
  amount: number;
  issuedAt: Date | null;
  deadline: number;
  deadlineType: "day" | "week" | "month" | "year";
  subscription: ObjectId | null;
}
export interface IUser {
  _id?: ObjectId;
  name: string;
  userName?: string;
  bio?: string;
  profileImage?: string;
  email: string;
  contactNumber: string;
  location: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
  password: string;
  confirmPassword: string | undefined;
  role: TUserRole;
  fcmToken?: string;
  verification?: IUserVerification;
  status?: "active" | "blocked" | "pending";
  payment: IPayment;
  msgResponse?: {
    isMyLastMessage: boolean;
  };
  ratings?: {
    star: number;
    totalReview: number;
    totalUser: number;
  };

  passwordChangedAt?: Date;
  isOnline?: boolean;
  isDeleted?: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<IUser> {
  isUserExistById(id: ObjectId, fields?: string): Promise<IUser>;
  isUserExistByEmail(email: string, fields?: string): Promise<IUser>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
