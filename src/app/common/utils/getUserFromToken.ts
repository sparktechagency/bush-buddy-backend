import jwt, { JwtPayload } from "jsonwebtoken";
import { CONFIG } from "../../core/config";
import { User } from "../../modules/base/user/user.model";

export const getUserFromToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    CONFIG.JWT.access_jwt_secret as string
  ) as JwtPayload;

  // Find and validate logged-in user
  const user = await User.isUserExistById(decoded.id, "_id isOnline");

  return user || null;
};
