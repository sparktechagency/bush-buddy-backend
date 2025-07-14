/* eslint-disable @typescript-eslint/no-explicit-any */
// src/common/socketErrorHandler.ts
import { Socket } from "socket.io";

export const emitSocketError = (socket: Socket, message: string) => {
  console.info("🚀 ~ emitSocketError ~ message:", message);
  socket.emit("io-error", "gdfgdf");
};
