/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { ObjectId, PipelineStage } from "mongoose";

import { paginationHelper } from "../../../common/helpers/pagination.helper";
import pickQuery from "../../../common/utils/query.pick";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { authService } from "../auth/auth.service";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const userData = {
    ...payload,
    role: USER_ROLE.USER,
    verification: { verified: false },
    subscription: { plan: "free" },
  };

  const newUser = await User.create([{ ...userData }]);

  const verifyEmail: any = await authService.sendOtpForVerifyEmail(
    (payload as any)?.email
  );
  return {
    user: newUser[0],
    verifyEmailToken: verifyEmail?.verifyEmailToken,
  }; // Return the created user
};

const getUsers = async (
  currentUser: ObjectId,
  query: Record<string, unknown>
) => {
  const { filters, pagination } = await pickQuery(query);

  const paginationFields = paginationHelper.calculatePagination(pagination);

  const { searchField, ...filtersData } = filters;

  const pipeline: PipelineStage[] = [];

  // Step 1: Match only active & verified users
  pipeline.push({
    $match: {
      isDeleted: false,
      status: "active",
      "verification.verified": true,
      _id: { $ne: currentUser },
    },
  });

  // Step 2: Check if current user follows this user (followedUserId)
  pipeline.push({
    $lookup: {
      from: "friends",
      let: { targetUserId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$friendId", "$$targetUserId"] },
                {
                  $eq: [
                    "$userId",
                    new mongoose.Types.ObjectId(String(currentUser)),
                  ],
                },
              ],
            },
          },
        },
        { $limit: 1 },
      ],
      as: "myFriendCheck",
    },
  });

  // Step 3: Add isImFollow field
  pipeline.push({
    $addFields: {
      isFriend: {
        $cond: {
          if: { $gt: [{ $size: "$myFriendCheck" }, 0] },
          then: true,
          else: false,
        },
      },
    },
  });

  // Step 3.1: Add search functionality
  if (searchField) {
    const searchRegex = new RegExp(searchField, "i");
    pipeline.push({
      $match: {
        $or: [
          { firstName: searchRegex },
          { email: searchRegex },
          { contactNumber: searchRegex },
        ],
      },
    });
  }
  // Step 3.2: Add filters
  if (Object.keys(filtersData).length > 0) {
    pipeline.push({
      $match: {
        ...filtersData,
      },
    });
  }
  // Step 3.3: Add sorting
  if (filtersData?.sort) {
    const sortField = filtersData.sort.startsWith("-")
      ? filtersData.sort.slice(1)
      : filtersData.sort;
    const sortDirection = filtersData.sort.startsWith("-") ? -1 : 1;

    pipeline.push({
      $sort: {
        [sortField]: sortDirection,
      },
    });
  }

  // Step 4: Remove unnecessary field
  pipeline.push({
    $project: {
      myFriendCheck: 0,
    },
  });

  pipeline.push({
    $skip: paginationFields?.skip || 0,
  });

  pipeline.push({
    $limit: paginationFields?.limit || 10,
  });

  const users = await User.aggregate(pipeline);
  return users;
};

// const getSingleUser = async() => {};

const updateMe = async (userId: ObjectId, payload: Partial<IUser> | any) => {
  payload.location = {
    type: "Point",
    coordinates: payload?.location?.coordinates,
  };
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const getMe = async (currentUser: ObjectId) => {
  // Step 1: Match only active & verified users

  const users = await User.findById(currentUser);
  return users;
};

export const userService = {
  createUser,
  getUsers,
  updateMe,
  getMe,
};
