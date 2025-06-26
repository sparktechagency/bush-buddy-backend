import httpStatus from "http-status";
import mongoose, { ObjectId, PipelineStage } from "mongoose";
import AppError from "../../../core/error/AppError";

import redis from "../../../common/utils/redis/redis";
import { deleteCacheByPattern } from "../../../common/utils/redis/redis.utils.ts";

import { paginationHelper } from "../../../common/helpers/pagination.helper";
import pickQuery from "../../../common/utils/query.pick";
import { ProductCat } from "../_categories/productCategory/productCategory.model";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";

const PRODUCT_CACHE_KEY = "products:all";

// 🔄 Validate ObjectId
const validateObjectId = (id: string | ObjectId, name = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${name}`);
  }
};

// ✅ Create Product
const createProduct = async (payload: IProduct) => {
  const isCatExist = await ProductCat.findOne({
    _id: payload.category,
    status: "active",
    isDeleted: false,
  });

  if (!isCatExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category does not exist");
  }

  const result = await Product.create(payload);

  // Invalidate cache
  await redis.del(PRODUCT_CACHE_KEY);
  await deleteCacheByPattern("products:*");

  return result;
};

// ✅ Update Product
const updateProduct = async (id: ObjectId, payload: IProduct) => {
  validateObjectId(id, "Product ID");

  const isCatExist = await ProductCat.exists({
    _id: payload.category,
    status: "active",
    isDeleted: false,
  });

  if (!isCatExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category does not exist");
  }

  const existingProduct = await Product.findOne({ _id: id, isDeleted: false });
  if (!existingProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  await redis.del(PRODUCT_CACHE_KEY);
  await deleteCacheByPattern("products:*");

  return result;
};

const getProduct = async (userId: ObjectId, query: Record<string, unknown>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const paginationFields = paginationHelper.calculatePagination(pagination);

  const pipeline: PipelineStage[] = [];

  pipeline.push({
    $match: { isDeleted: false },
  });

  pipeline.push({
    $lookup: {
      from: "productwishlists",
      let: { wishListId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$itemId", "$$wishListId"] },
                { $eq: ["$user", new mongoose.Types.ObjectId(String(userId))] },
              ],
            },
          },
        },
        {
          $limit: 1,
        },
      ],
      as: "wishListCheck",
    },
  });

  pipeline.push({
    $addFields: {
      isWishListed: {
        $cond: [{ $gt: [{ $size: "$wishListCheck" }, 0] }, true, false],
      },
    },
  });

  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      },
    });
  }
  if (filtersData.category) {
    validateObjectId(filtersData.category, "Category ID");
    filtersData.category = new mongoose.Types.ObjectId(filtersData.category);
  }
  if (filtersData.price) {
    const [minPrice, maxPrice] = filtersData.price.split("-");
    filtersData.price = {
      $gte: parseFloat(minPrice),
      $lte: parseFloat(maxPrice),
    };
  }
  if (filtersData.rating) {
    const [minRating, maxRating] = filtersData.rating.split("-");
    filtersData.rating = {
      $gte: parseFloat(minRating),
      $lte: parseFloat(maxRating),
    };
  }
  if (filtersData.stock) {
    filtersData.stock = { $gte: parseInt(filtersData.stock, 10) };
  }

  if (Object.keys(filtersData).length > 0) {
    pipeline.push({
      $match: filtersData,
    });
  }

  pipeline.push({
    $project: {
      wishListCheck: 0,
    },
  });

  pipeline.push({
    $skip: paginationFields.skip,
  });

  pipeline.push({
    $limit: paginationFields.limit,
  });

  const result = await Product.aggregate(pipeline);

  return {
    meta: {
      page: paginationFields.page,
      limit: paginationFields.limit,
      total: await Product.countDocuments({ isDeleted: false }),
    },
    data: result,
  };
};

// ✅ Get single Product (with redis cache)
const getSingleProduct = async (id: ObjectId) => {
  const cacheKey = `product:${id.toString()}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const result = await Product.findById(id).where({ isDeleted: false }).lean();

  if (result) {
    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 5);
  }

  return result;
};

// ✅ Delete Product (soft delete)
const deleteProduct = async (id: ObjectId) => {
  validateObjectId(id, "Product ID");

  const existingProduct = await Product.findOne({ _id: id, isDeleted: false });
  if (!existingProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true }
  );

  await redis.del(PRODUCT_CACHE_KEY);
  await deleteCacheByPattern("products:*");
  return result;
};

// ⛳ Export Service
export const product_service = {
  createProduct,
  updateProduct,
  getProduct,
  getSingleProduct,
  deleteProduct,
};
