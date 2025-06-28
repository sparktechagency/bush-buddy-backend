/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId, startSession } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { User } from "../../base/user/user.model";

const getUserInfo = async (query: Record<string, any>) => {
  if (query?.createdAt) {
    // Convert the createdAt field to a Date if it is provided
    query.createdAt = new Date((query as any).createdAt);
    const { createdAt, remainingQuery } = query;

    // Get the start of the month
    const startOfMonth = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      1
    );

    // Get the end of the month (last day of the month)
    const endOfMonth = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const accountsQuery = new QueryBuilder(
      User.find({
        isDeleted: false,
        status: "active",
        "verification.verified": true,
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }),
      remainingQuery
    )
      .search(["firstName", "userName", "role"])
      .sort()
      .paginate()
      .fields();

    const meta = await accountsQuery.countTotal();
    const data = await accountsQuery.modelQuery;

    return { meta, data };
  }

  // If no createdAt filter is provided, return all users
  const accountsQuery = new QueryBuilder(
    User.find({
      isDeleted: false,
      status: "active",
      "verification.verified": true,
    }),
    query
  )
    .search(["firstName", "userName", "role"])
    .sort()
    .paginate()
    .fields();

  const meta = await accountsQuery.countTotal();
  const data = await accountsQuery.modelQuery;

  return { meta, data };
};

const deleteUser = async (userId: ObjectId) => {
  //   if (config.node_env === "development") {
  //     throw new AppError(
  //       httpStatus.FORBIDDEN,
  //       "This api blocked for development purpose"
  //     );
  //   }

  const user = await User.isUserExistById(userId);

  if (user.role === USER_ROLE.USER) {
    await User.findByIdAndUpdate(userId, { isDeleted: true });
    return `The buyer ${user.name} is deleted successful`;
  }

  const session = await startSession();

  try {
    session.startTransaction();

    await User.findByIdAndUpdate(userId, { isDeleted: true }, { session });

    await session.commitTransaction();

    return `The ${user.role} ${user.name} is deleted successful`;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Transaction field");
  } finally {
    await session.endSession();
  }
};

export const accountDetailsServices = {
  getUserInfo,
  deleteUser,
};
