/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { Server } from "socket.io";
import { getUserFromToken } from "../app/common/utils/getUserFromToken";
import { User } from "../app/modules/base/user/user.model";

const setUserOnline = async (
  token: string,
  io: Server
): Promise<JwtPayload | null> => {
  try {
    const user = await getUserFromToken(token);
    if (user) {
      await User.findByIdAndUpdate(user._id, { isOnline: true });
      return user;
    }
    return null;
  } catch (error: any) {
    console.info("🚀 userStatusHandler setUserOnline error:", error);
    io.emit("io-error", {
      success: false,
      message: error.message || "unknown error",
    });
    return null;
  }
};

const setUserOffline = async (userId: string) => {
  try {
    await User.findByIdAndUpdate(userId, { isOnline: false });
  } catch (error) {
    console.info("🚀 userStatusHandler setUserOffline error:", error);
  }
};

export default {
  setUserOnline,
  setUserOffline,
};
