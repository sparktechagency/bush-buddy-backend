/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// socketHandler.ts

import httpStatus from "http-status";
import { Server, Socket } from "socket.io";
import AppError from "../app/core/error/AppError";
import { messageHandler } from "./messageHandler.live";
import userStatusHandler from "./userStatusHandler";

const socketHandler = (io: Server) => {
  // ✅ Middleware for authentication
  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;

    if (!token) {
      return next(new AppError(httpStatus.NOT_FOUND, "Token not found")); // ❌ Connection won't happen
    }

    const user = await userStatusHandler.setUserOnline(token, io);

    if (!user) {
      return next(new AppError(httpStatus.NOT_FOUND, "Invalid token")); // ❌ Connection won't happen
    }

    // Attach user to socket object for use later
    (socket as any).user = user;
    next();
  });

  // ✅ Actual socket connection (only if middleware passes)
  io.on("connection", async (socket: Socket) => {
    const { user } = socket as any;
    console.log(`✅ Authenticated user connected: ${socket.id}`);

    messageHandler(io, socket, user);

    socket.on("disconnect", async () => {
      await userStatusHandler.setUserOffline(user._id);
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;

// /* eslint-disable no-console */
// import { Server } from "socket.io";

// import { emitSocketError } from "./errorHandler";
// import { messageHandler } from "./messageHandler.live";
// import userStatusHandler from "./userStatusHandler";

// const socketHandler = (io: Server) => {
//   io.on("connection", async (socket) => {
//     console.log(`✅ User connected: ${socket.id}`);

//     // Get token from handshake
//     const token =
//       socket.handshake.auth?.token || socket.handshake.headers?.token;
//     console.log("🚀 ~ io.on ~ token:", token);
//     if (!token) {
//       console.log("🚀 ~ io.on ~ token:2", token);
//       emitSocketError(socket, "Token not found");
//       return;
//     }

//     const user = await userStatusHandler.setUserOnline(token, io);
//     if (!user) {
//       emitSocketError(socket, "Invalid token");
//       return;
//     }

//     messageHandler(io, socket, user);

//     socket.on("disconnect", async () => {
//       await userStatusHandler.setUserOffline(user._id);
//       console.log(`❌ User disconnected: ${socket.id}`);
//     });
//   });
// };

// export default socketHandler;
