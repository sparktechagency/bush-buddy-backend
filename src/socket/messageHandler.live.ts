/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { User } from "../app/modules/base/user/user.model";
import { emitSocketError } from "./errorHandler";

const globalMessages: any[] = [];
const globalGroupMessages: any[] = [];

const messageHandler = (io: Server, socket: Socket, user: any) => {
  socket.on("senderMsg", async (message) => {
    try {
      socket.emit("io-error-t", "gdfgdf");
      // ✅ Input validation
      if (!message?.content || !message?.receiver) {
        // console.log("🚀 ~ socket.on ~ message:", message);
        // return emitSocketError(
        //   socket,
        //   "Invalid message format. 'content' and 'receiver' are required."
        // );
      }

      // ✅ Check if user exists
      const userExists = await User.isUserExistById(user._id);
      if (!userExists) {
        return emitSocketError(socket, "User does not exist.");
      }

      const newMessage = {
        content: message.content,
        sender: user._id,
        images: message.images || [],
        receiver: new mongoose.Types.ObjectId(message.receiver),
        timestamp: new Date(),
      };

      globalMessages.push(newMessage);
      io.emit(`receiverMsg::${message.receiver}`, globalMessages);
    } catch (err) {
      console.error("Error in senderMsg:", err);
      emitSocketError(
        socket,
        "Something went wrong while sending the message."
      );
    }
  });
};

export { globalGroupMessages, globalMessages, messageHandler };

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose from "mongoose";
// import { Server, Socket } from "socket.io";
// import { User } from "../app/modules/base/user/user.model";

// const globalMessages: any[] = [];
// const globalGroupMessages: any[] = [];

// const messageHandler = (io: Server, socket: Socket, user: any) => {
//   socket.on("senderMsg", async (message) => {
//     await User.isUserExistById(user._id);

//     const newMessage = {
//       content: message.content,
//       sender: user._id,
//       images: message.images || [],
//       receiver: new mongoose.Types.ObjectId(message.receiver),
//       timestamp: new Date(),
//     };

//     globalMessages.push(newMessage);
//     io.emit(`receiverMsg::${message.receiver}`, globalMessages);
//   });
// };

// export { globalGroupMessages, globalMessages, messageHandler };
