/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import { CONFIG } from "../../../core/config";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const seedSuperAdmin = async () => {
  const superUser: IUser = {
    name: "Super Admin",
    email: CONFIG.CORE.supper_admin_email!,
    password: CONFIG.CORE.supper_admin_pass!,
    confirmPassword: CONFIG.CORE.supper_admin_pass!,
    contactNumber: "+17788990011",
    role: USER_ROLE.ADMIN,
    locationName: "Miami, USA",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    verification: {
      verified: true,
    },
    msgResponse: {
      isMyLastMessage: true,
    },
    payment: {
      status: "free",
      totalPay: 0,
      amount: 0,
      issuedAt: new Date(),
      deadline: 0,
      deadlineType: "month",
      subscription: undefined as any, // Replace with a valid ObjectId if available
    }, // default payment object as required by IUser
  };

  const isSuperAdminExits = await User.findOne({
    role: USER_ROLE.ADMIN,
  });

  if (!isSuperAdminExits) {
    return await User.create(superUser);
  }
  return null;
};

const getAdmin = async (id: string) => {
  const admin: IUser | any = await User.findById(id);

  if (admin?.role === "admin") {
    return admin;
  }

  throw new AppError(httpStatus.NOT_FOUND, "Admin not found!");
};

export const adminService = {
  seedSuperAdmin,
  getAdmin,
};
