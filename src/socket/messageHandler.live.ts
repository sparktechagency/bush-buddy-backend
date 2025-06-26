/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { User } from "../app/modules/base/user/user.model";

const globalMessages: any[] = [];
const globalGroupMessages: any[] = [];

const messageHandler = (io: Server, socket: Socket, user: any) => {
  socket.on("senderMsg", async (message) => {
    await User.isUserExistById(user._id);

    const newMessage = {
      content: message.content,
      sender: user._id,
      images: message.images || [],
      receiver: new mongoose.Types.ObjectId(message.receiver),
      timestamp: new Date(),
    };

    globalMessages.push(newMessage);
    io.emit(`receiverMsg::${message.receiver}`, globalMessages);
  });
};

export { globalGroupMessages, globalMessages, messageHandler };
