import httpStatus from "http-status";
import mongoose, { ObjectId, PipelineStage } from "mongoose";

import redis from "../../../common/utils/redis/redis";
import { deleteCacheByPattern } from "../../../common/utils/redis/redis.utils.ts";
import AppError from "../../../core/error/AppError";

import { paginationHelper } from "../../../common/helpers/pagination.helper";
import { validateObjectId } from "../../../common/utils/global.validation";
import pickQuery from "../../../common/utils/query.pick";
import { ServiceCat } from "../_categories/ServiceCategory/serviceCategory.model";
import { IService } from "./service.interface";
import { Service } from "./service.model";

const Service_CACHE_KEY = "Services:all";

// ✅ Create Service
const createService = async (payload: IService) => {
  const isCatExist = await ServiceCat.findOne({
    _id: payload.category,
    status: "active",
    isDeleted: false,
  });

  if (!isCatExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category does not exist");
  }

  const result = await Service.create(payload);

  // Invalidate cache
  await redis.del(Service_CACHE_KEY);
  await deleteCacheByPattern("Services:*");

  return result;
};

// ✅ Update Service
const updateService = async (id: ObjectId, payload: IService) => {
  validateObjectId(id, "Service ID");

  const isCatExist = await ServiceCat.exists({
    _id: payload.category,
    status: "active",
    isDeleted: false,
  });

  if (!isCatExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category does not exist");
  }

  const existingService = await Service.findOne({ _id: id, isDeleted: false });
  if (!existingService) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const result = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  await redis.del(Service_CACHE_KEY);
  await deleteCacheByPattern("Services:*");

  return result;
};

// ✅ Get Services (with redis cache)
// const getService = async (query: Record<string, unknown>) => {
//   const cacheKey = generateCacheKey("Services", query);

//   const cachedData = await redis.get(cacheKey);
//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   const ServiceQuery = new QueryBuilder(
//     Service.find({ isDeleted: false }),
//     query
//   )
//     .search(["name"])
//     .filter()
//     .fields()
//     .sort()
//     .paginate();

//   const meta = await ServiceQuery.countTotal();
//   const data = await ServiceQuery.modelQuery;

//   const result = { meta, data };

//   // Cache for 5 minutes
//   await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 5);

//   return result;
// };
const getService = async (userId: ObjectId, query: Record<string, unknown>) => {
  const { filters, pagination } = await pickQuery(query);

  const { searchTerm, ...filtersData } = filters;

  const paginationFields = paginationHelper.calculatePagination(pagination);
  console.log("🚀 ~ getService ~ paginationFields:", paginationFields);

  const pipeline: PipelineStage[] = [];

  pipeline.push({
    $match: { isDeleted: false },
  });

  pipeline.push({
    $lookup: {
      from: "servicewishlists",
      let: { serviceId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$itemId", "$$serviceId"] },
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
        $or: [{ name: { $regex: searchTerm, $options: "i" } }],
      },
    });
  }

  if (filtersData) {
    pipeline.push({
      $match: filtersData,
    });
  }

  if (filtersData.category) {
    validateObjectId(filtersData.category, "Category ID");
    filtersData.category = new mongoose.Types.ObjectId(filtersData.category);
    pipeline.push({
      $match: { category: filtersData.category },
    });
  }

  if (filtersData.price) {
    const [minPrice, maxPrice] = filtersData.price.split("-");
    filtersData.price = {
      $gte: parseFloat(minPrice),
      $lte: parseFloat(maxPrice),
    };
    pipeline.push({
      $match: { price: filtersData.price },
    });
  }

  pipeline.push({
    $skip: paginationFields.skip,
  });
  pipeline.push({
    $limit: paginationFields.limit,
  });

  pipeline.push({
    $project: { wishListCheck: 0 },
  });

  const data = Service.aggregate(pipeline);

  const meta = {
    page: paginationFields.page,
    limit: paginationFields.limit,
    total: await Service.countDocuments({ isDeleted: false }),
  };

  return {
    meta,
    data,
  };
};

const getSingleService = async (id: ObjectId) => {
  const cacheKey = `product:${id.toString()}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const result = await Service.findById(id).where({ isDeleted: false }).lean();

  if (result) {
    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 5);
  }

  return result;
};

// ✅ Delete Service (soft delete)
const deleteService = async (id: ObjectId) => {
  validateObjectId(id, "Service ID");

  const existingService = await Service.findOne({ _id: id, isDeleted: false });
  if (!existingService) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const result = await Service.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true }
  );

  await redis.del(Service_CACHE_KEY);
  await deleteCacheByPattern("Services:*");
  return result;
};

// ⛳ Export Service
export const Service_service = {
  createService,
  updateService,
  getService,
  getSingleService,
  deleteService,
};
