import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CONFIG } from "../config";

import catchAsync from "../../common/utils/catchAsync";
import { TUserRole } from "../../modules/base/user/user.interface";
import { User } from "../../modules/base/user/user.model";
import AppError from "../error/AppError";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      CONFIG.JWT.access_jwt_secret as string
    ) as JwtPayload;

    const { role, id, iat } = decoded;

    // Find validate log in user
    const user = await User.isUserExistById(id);
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!!!");
    }

    req.user = decoded as JwtPayload & { role: string };
    next();
  });
};

export default auth;
