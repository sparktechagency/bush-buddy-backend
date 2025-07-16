/* eslint-disable @typescript-eslint/no-explicit-any */
// src/common/socketErrorHandler.ts
import { Socket } from "socket.io";

export const ioError = (socket: Socket, message: string) => {
  socket.emit("io-error", message);
};
