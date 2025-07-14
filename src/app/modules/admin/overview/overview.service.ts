import { endOfDay, startOfDay } from "date-fns";
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId, PipelineStage } from "mongoose";
import { monthSortName } from "../../../common/helpers/query.helpars";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import AppError from "../../../core/error/AppError";
import { User } from "../../base/user/user.model";

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

  return User.findByIdAndUpdate(adminId, payload, { new: true });
};

const userOverview = async (currentYear: number) => {
  const year = Number(currentYear);

  if (!year) {
    throw new AppError(httpStatus.BAD_REQUEST, "Year must be in query url!!");
  }

  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year + 1}-01-01`);

  const pipeline: PipelineStage[] = [];

  pipeline.push({
    $match: {
      createdAt: {
        $gte: start,
        $lt: end,
      },
    },
  });

  pipeline.push({
    $group: {
      _id: { $month: "$createdAt" },
      totalUsers: { $sum: 1 },
    },
  });

  pipeline.push({
    $project: {
      monthNumber: "$_id",
      totalUsers: 1,
      _id: 0,
    },
  });

  pipeline.push({
    $sort: { month: 1 },
  });

  const raw = await User.aggregate(pipeline);

  const monthlyUsers = monthSortName.map((name, i) => {
    const found = raw.find((item) => item.monthNumber === i + 1);

    return {
      month: name,
      totalUsers: found?.totalUsers || 0,
    };
  });

  const totalUsersInDB = await User.countDocuments();

  const totalIncomeResult = await User.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$payment.totalPay" },
      },
    },
  ]);

  const totalIncome = totalIncomeResult[0]?.totalIncome || 0;

  return {
    totalIncome,
    totalUsersInDB,
    monthlyUsers,
  };
};

const totalIncomeAndUser = async () => {
  const totalUsersInDB = await User.countDocuments();

  const totalIncomeResult = await User.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$payment.totalPay" },
      },
    },
  ]);

  const totalIncome = totalIncomeResult[0]?.totalIncome || 0;

  return {
    totalIncome,
    totalUsersInDB,
  };
};

const getIncomeSummary = async (query: Record<string, unknown>) => {
  // 1. Total Income from all users
  const totalIncomeResult = await User.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$payment.totalPay" },
      },
    },
  ]);

  const totalIncome = totalIncomeResult[0]?.totalIncome || 0;

  // 2. Today's Income: sum of payment.totalPay where payment.issuedAt is today
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todayIncomeResult = await User.aggregate([
    {
      $match: {
        "payment.issuedAt": {
          $gte: todayStart,
          $lte: todayEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        todayIncome: { $sum: "$payment.totalPay" },
      },
    },
  ]);

  const todayIncome = todayIncomeResult[0]?.todayIncome || 0;

  // All users
  const userQuery = new QueryBuilder(User.find(), query)
    .search(["name", "userName", "name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const data = await userQuery.modelQuery;

  return {
    totalIncome,
    todayIncome,
    meta,
    data,
  };
};

export const overviewService = {
  updateAdmin,
  userOverview,
  totalIncomeAndUser,
  getIncomeSummary,
};
