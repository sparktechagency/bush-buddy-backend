/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import chalk from "chalk";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { CONFIG } from "./app/core/config";
import { adminService } from "./app/modules/base/admin/admin.service";

import { server as socketServer } from "./socket/socket.server";

let server: Server;
// ✅ Handle uncaught exceptions (e.g., synchronous errors)
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception detected. Shutting down...");
  console.error(err);
  process.exit(1);
});

// ✅ Main function to connect DB and start servers
async function main() {
  try {
    // await initializeApolloServer(app);

    // Connect to MongoDB
    await mongoose.connect(CONFIG.CORE.db_uri as string);
    console.info(chalk.blueBright("📦 Connected to MongoDB"));

    // Start the Express application server
    server = app.listen(
      Number(CONFIG.CORE.port),
      CONFIG.CORE.ip ?? "localhost",
      () => {
        console.info(
          chalk.bgBlackBright(
            `✅ Server is listening on http://${CONFIG.CORE.ip ?? "localhost"}:${CONFIG.CORE.port} `
          )
        );
      }
    );

    // await sendNotification(
    //   [
    //     "eu3jxt4lwBpw7PAhACgqa6:APA91bEMaHPKEzZppBt9LZs9EerQ7Wb90OYALdYsTjxZJHrbSDS4-mZK4rmQYSvQVbkM9O0uLT2Cse3G7DAwUhTgCEWWfw8D-u94ldVewSKxU2MyKAeXMIM",
    //   ],
    //   {
    //     title: "Hi, Hridoy🔴🔴🔴🔴🔴🔴🔴",
    //     message: "How are you?",
    //     receiver: new mongoose.Types.ObjectId("6874df34c056e32a245fb05c"),
    //   }
    // );

    // Seed the initial Super Admin user (if needed)
    await adminService.seedSuperAdmin();

    // Start the Socket.IO server
    socketServer.listen(
      {
        port: CONFIG.CORE.socket_port,
        host: CONFIG.CORE.ip,
      },
      () => {
        console.info(
          chalk.bgYellowBright(
            `🗨️  Socket is running at http://${CONFIG.CORE.ip ?? "localhost"}:${CONFIG.CORE.socket_port}`
          )
        );
      }
    );
  } catch (err) {
    console.error("❌ Failed to start the server.");
    console.error(err);
    process.exit(1);
  }
}

// ✅ Handle unhandled promise rejections (e.g., async errors)
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection detected. Shutting down...");
  console.error(err);

  if (server) {
    // Gracefully close the server before exiting
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// ✅ Start the main application
main();
