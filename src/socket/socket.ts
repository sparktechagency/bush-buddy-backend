// /* eslint-disable no-undef */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import http from "http";
// import { JwtPayload } from "jsonwebtoken";
// import mongoose from "mongoose";
// import cron from "node-cron";
// import { Server } from "socket.io";
// import app from "../../app";
// import { Chat } from "../modules/chat/chat.model";
// import { Seller } from "../modules/seller/seller.model";
// import { User } from "../publicModules/user/user.model";
// import { getUserFromToken } from "../utils/getUserFromToken";

// // Setup Express and Socket.io
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// // Global message arrays
// const globalMessages: any[] = [];
// const globalGroupMessages: any[] = [];

// io.on("connection", async (socket) => {
//   console.log(`✅ User connected: ${socket.id}`);

//   const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

//   if (!token) {
//     io.emit("io-error", { success: false, message: "Token not found" });
//     return;
//   }

//   let user: JwtPayload | any;
//   if (token) {
//     try {
//       user = await getUserFromToken(token);
//       await User.findByIdAndUpdate(user._id, { isOnline: true });
//     } catch (error: any) {
//       console.log("🚀 ~ io.on ~ error:", error);
//       io.emit("io-error", {
//         success: false,
//         message: error.message || "unknown error",
//       });
//       return;
//     }
//   }

//   if (!user) {
//     io.emit("io-error", { success: false, message: "invalid Token" });
//   }

//   // * One to one message

//   if (user) {
//     // console.log("🚀 ~ io.on ~ user:2", user);
//     //✅ Get message from frontend
//     socket.on(`senderMsg`, async (message) => {
//       if (user.role === "seller") {
//         const seller = await Seller.findOne({ user: user._id });
//         console.log(
//           "🚀 ~ socket.on ~ seller:tammu",
//           seller?.msgResponse?.isBuyerLastMsg
//         );
//         console.log("🚀 ~ socket.on ~ seller:tammu", {
//           sender: message.receiver,
//           receiver: user._id,
//         });

//         if (seller?.msgResponse?.isBuyerLastMsg) {
//           // Fetch the buyer's chat time
//           const buyerMsgTime = await Chat.findOne({
//             sender: message.receiver,
//             receiver: user._id,
//           }).sort("-createdAt");
//           console.log("🚀 ~ socket.on ~ buyerMsgTime:", buyerMsgTime);

//           // Get the current time as seller's message time
//           const sellerMsgTime = Date.now();

//           // Check if the buyer's message exists
//           if (!buyerMsgTime) {
//             console.error("Buyer chat time not found.");
//             console.log(
//               "🚀 ~ socket.on ~ message?.receiver:",
//               message?.receiver
//             );
//             return; // or handle this case as needed
//           }

//           // Convert both times to timestamps
//           const buyerTime = new Date(buyerMsgTime.updatedAt).getTime();
//           const sellerTime = sellerMsgTime;

//           // If seller's message is before or at the same time as buyer's message, show 0
//           if (sellerTime <= buyerTime) {
//             console.log("Time difference: 0");
//           } else {
//             // Calculate the time difference if seller's message is after the buyer's message
//             const timeDifference = (
//               (sellerTime - buyerTime) /
//               (1000 * 60)
//             ).toFixed(2);

//             const avgResTime =
//               seller?.msgResponse?.totalResTime /
//                 seller?.msgResponse?.totalMessage +
//                 1 || seller.msgResponse.avgResTime; // Set as ms

//             await Seller.findOneAndUpdate(
//               { user: user._id },
//               {
//                 "msgResponse.isBuyerLastMsg": false,
//                 $inc: {
//                   "msgResponse.totalResTime": timeDifference,
//                   "msgResponse.totalMessage": 1,
//                 },
//                 "msgResponse.avgResTime": avgResTime,
//               }
//             );
//           }
//         }
//       }

//       if (user.role === "buyer") {
//         await Seller.findOneAndUpdate(
//           { user: message.receiver },
//           { "msgResponse.isBuyerLastMsg": true }
//         );
//       }

//       const newMessage = {
//         content: message.content,
//         sender: user._id,
//         receiver: new mongoose.Types.ObjectId(message.receiver),
//         timestamp: new Date(),
//       };
//       globalMessages.push(newMessage);

//       console.log("Reciever id: ", message?.receiver, globalMessages);
//       // Send message backend
//       io.emit(`receiverMsg::${message?.receiver}`, globalMessages);
//     });
//   }

//   // *  ----------------------------------------------------------------------

//   // ❌ Handle disconnection
//   socket.on("disconnect", async () => {
//     await User.findByIdAndUpdate(user._id, { isOnline: false });
//   });
// });

// // Cron job to process messages every second
// cron.schedule("* * * * * *", async () => {
//   try {
//     const batchSize = 200;

//     // Function to process individual messages
//     const singleMessageFunction = async () => {
//       if (globalMessages.length > 0) {
//         const batches = [];
//         while (globalMessages.length > 0) {
//           batches.push(globalMessages.splice(0, batchSize)); // Extract 200 messages at a time
//         }
//         await Promise.all(batches.map((batch) => Chat.insertMany(batch)));
//       }
//     };

//     // Function to process group messages
//     const groupMessageFunction = async () => {
//       if (globalGroupMessages.length > 0) {
//         const batches = [];
//         while (globalGroupMessages.length > 0) {
//           batches.push(globalGroupMessages.splice(0, batchSize)); // Extract 200 messages at a time
//         }
//         await Promise.all(batches.map((batch) => Chat.insertMany(batch)));
//       }
//     };

//     await Promise.all([singleMessageFunction(), groupMessageFunction()]);
//   } catch (error) {
//     console.log("🚀 cron.schedule error:", error);
//   }
// });

// export { server };
