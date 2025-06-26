import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import AppError from "../../core/error/AppError";

// 🔄 Validate ObjectId
export const validateObjectId = (id: string | ObjectId, name = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${name}`);
  }
};
