/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { User } from "../app/modules/base/user/user.model";
import { IChat } from "../app/modules/contextual/chat/chat.interface";
import { ioError } from "./io.error";

const globalMessages: any[] = [];
const globalGroupMessages: any[] = [];

const messageHandler = (io: Server, socket: Socket, user: any) => {
  socket.on("senderMsg", async (message) => {
    try {
      socket.emit("io-error-t", "gdfgdf");
      // ✅ Input validation
      if (!message?.content || !message?.receiver) {
        return ioError(
          socket,
          "Invalid message format. 'content' and 'receiver' are required."
        );
      }

      // ✅ Check if user exists
      const userExists = await User.isUserExistById(user._id);
      if (!userExists) {
        return ioError(socket, "User does not exist.");
      }

      const newMessage: IChat = {
        _id: new mongoose.Types.ObjectId(),
        content: message.content,
        sender: user._id,
        receiver: new mongoose.Types.ObjectId(message.receiver),
        images: message.images || [],
        location: {
          type: "Point",
          coordinates: message.location,
        },
        isImage: !!(message.images && message.images.length > 0),
        isSenderRead: true,
        isReceiverRead: false,
        isShow: true,
        chatTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      globalMessages.push(newMessage);
      io.emit(`receiverMsg::${message.receiver}`, globalMessages);
    } catch (err) {
      console.error("Error in senderMsg:", err);
      ioError(socket, "Something went wrong while sending the message.");
    }
  });
};

export { globalGroupMessages, globalMessages, messageHandler };
