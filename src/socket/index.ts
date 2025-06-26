import { Server } from "socket.io";

import { messageHandler } from "./messageHandler.live";
import userStatusHandler from "./userStatusHandler";

const socketHandler = (io: Server) => {
  io.on("connection", async (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Get token from handshake
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;
    if (!token) {
      io.emit("io-error", { success: false, message: "Token not found" });
      return;
    }

    const user = await userStatusHandler.setUserOnline(token, io);
    if (!user) {
      io.emit("io-error", { success: false, message: "Invalid token" });
      return;
    }

    messageHandler(io, socket, user);

    socket.on("disconnect", async () => {
      await userStatusHandler.setUserOffline(user._id);
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;
