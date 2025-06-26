/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import { monthNames } from "../../../common/helpers/query.halpers";
import AppError from "../../../core/error/AppError";
import { User } from "../../base/user/user.model";

const getUserChart = async (year: string = "2025") => {
  // Generate an array with all months, initializing buyers and sellers to 0
  const allMonths = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    buyers: 0,
    sellers: 0,
  }));

  const userStats = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00Z`),
          $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.month",
        buyers: {
          $sum: {
            $cond: [{ $eq: ["$_id.role", "buyer"] }, "$count", 0],
          },
        },
        sellers: {
          $sum: {
            $cond: [{ $eq: ["$_id.role", "seller"] }, "$count", 0],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Merge aggregated data with the allMonths array
  const chartData = allMonths.map((monthData) => {
    const found = userStats.find((stat) => stat._id === monthData.month);
    return {
      month: monthNames[monthData.month - 1],
      buyers: found ? found.buyers : 0,
      sellers: found ? found.sellers : 0,
    };
  });

  return { year, chartData };
};

const updateAdmin = async (adminId: ObjectId, payload: any) => {
  if (payload?.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Don't allow to change email directly!"
    );
  }
  if (payload?.phoneNumber) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Don't allow to change phone number directly!"
    );
  }
  if (payload?.userName) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Don't allow to change userName directly!"
    );
  }

  const result = User.findByIdAndUpdate(adminId, payload, { new: true });

  return result;
};

export const overviewService = { getUserChart, updateAdmin };
