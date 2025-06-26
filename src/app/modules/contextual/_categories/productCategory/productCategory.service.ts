/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from "buffer";
import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import redis from "../../../../common/utils/redis/redis";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import AppError from "../../../../core/error/AppError";
import { User } from "../../../base/user/user.model";
import { bustProductCategoryCache } from "./productCategory.busting";
import { IProductCategory } from "./productCategory.interface";
import { ProductCat } from "./productCategory.model";

const createCategory = async (userId: ObjectId, payload: IProductCategory) => {
  await User.isUserExistById(userId);

  payload.creator = userId;
  payload.name = payload.name.toLocaleLowerCase();

  const result = await ProductCat.create(payload);

  // ✅ Cache busting (e.g. delete category list cache)
  await bustProductCategoryCache();

  return result;
};

const updateCategory = async (catId: string, payload: IProductCategory) => {
  const isCategoryExist = await ProductCat.findById(catId);

  if (!isCategoryExist) {
    throw new AppError(httpStatus.FORBIDDEN, "Category not found!");
  }
  if (isCategoryExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Category was deleted!");
  }

  const result = await ProductCat.findByIdAndUpdate(
    catId,
    {
      ...payload,
      name: payload.name.toLocaleLowerCase(),
    },
    { new: true }
  );

  // ✅ Cache busting
  await bustProductCategoryCache();

  return result;
};

const getCategory = async (query: Record<string, any>) => {
  if (query.childOf && mongoose.Types.ObjectId.isValid(query.childOf)) {
    const parentCategory = new mongoose.Types.ObjectId(query.childOf);
    query["parent.parentCatId"] = parentCategory;
    delete query.childOf;
    // query["parent.parentCatId"] = new mongoose.Types.ObjectId(query.childOf);
    // delete query.childOf;
  }

  const queryStr = Buffer.from(JSON.stringify(query)).toString("base64");
  const cacheKey = `productCategories:${queryStr}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const categoryQuery = new QueryBuilder(
    ProductCat.find({ isDeleted: false }),
    query
  )
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  const response = { meta, result };

  await redis.set(cacheKey, JSON.stringify(response), "EX", 3600); // 1hr

  return response;
};

const deleteCategory = async (catId: ObjectId) => {
  const isCategoryExist = await ProductCat.findById(catId);

  if (!isCategoryExist) {
    throw new AppError(httpStatus.FORBIDDEN, "Category not found!");
  }
  if (isCategoryExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Category was deleted!");
  }

  await ProductCat.findByIdAndUpdate(catId, { isDeleted: true }, { new: true });

  // ✅ Cache busting (e.g. delete category list cache)
  await bustProductCategoryCache();

  return await ProductCat.findByIdAndUpdate(
    catId,
    { isDeleted: true },
    { new: true }
  );
};

export const categoryService = {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};
