import axios from "axios";
import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { CONFIG } from "../../../core/config";
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

  return await Hunt.findByIdAndUpdate(hunt._id, payload, { new: true });
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

  return await Hunt.findByIdAndUpdate(
    hunt._id,
    { isDeleted: true },
    { new: true }
  );
};

const getWeather = async (query: Record<string, unknown>) => {
  if (!query?.city) {
    throw new AppError(httpStatus.BAD_GATEWAY, "City name must be provided!");
  }

  const apiKey = CONFIG.OTHER.open_weather_pai_key;
  console.log("🚀 ~ getWeather ~ apiKey:", apiKey);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query?.city}&units=metric&appid=${apiKey}`;

  return await axios.get(url);
};

export const hunt_service = {
  createHunt,
  getMyHunt,
  getHunt,
  updateHunt,
  deleteMyHunt,
  getWeather,
};
