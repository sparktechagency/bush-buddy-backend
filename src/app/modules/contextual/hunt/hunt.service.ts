import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import AppError from "../../../core/error/AppError";
import { IHunt } from "./hunt.interface";
import { Hunt } from "./hunt.model";

const createHunt = async (payload: IHunt) => {
  const result = await Hunt.create(payload);
  return result;
};

const getMyHunt = async (
  currentUser: ObjectId,
  query: Record<string, unknown>
) => {
  const huntQuery = new QueryBuilder(
    Hunt.find({
      status: "approved",
      isDeleted: false,
      author: new mongoose.Types.ObjectId(String(currentUser)),
    }).populate({
      path: "author",
      select: "name userName email profileImage",
    }),
    query
  )
    .search(["title"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await huntQuery.countTotal();
  const data = await huntQuery.modelQuery;

  return {
    meta,
    data,
  };
};

const getHunt = async (query: Record<string, unknown>) => {
  const huntQuery = new QueryBuilder(
    Hunt.find({ status: "approved", isDeleted: false }).populate({
      path: "author",
      select: "name userName email profileImage",
    }),
    query
  )
    .search(["title"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await huntQuery.countTotal();
  const data = await huntQuery.modelQuery;

  return {
    meta,
    data,
  };
};

const updateHunt = async (huntId: ObjectId, payload: Partial<IHunt>) => {
  const hunt = await Hunt.findOne({ _id: huntId, author: payload.author });

  if (!hunt) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Your hunt post is not exist in database!"
    );
  }

  const result = await Hunt.findByIdAndUpdate(hunt._id, payload, { new: true });
  return result;
};

const deleteMyHunt = async (huntId: ObjectId, author: ObjectId) => {
  const hunt = await Hunt.findOne({
    _id: huntId,
    author: author,
    isDeleted: false,
  });

  if (!hunt) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Your hunt post is not found in database!"
    );
  }

  const result = await Hunt.findByIdAndUpdate(
    hunt._id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const hunt_service = {
  createHunt,
  getMyHunt,
  getHunt,
  updateHunt,
  deleteMyHunt,
};
