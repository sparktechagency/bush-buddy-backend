import http from "http";
import { Server } from "socket.io";
import socketHandler from ".";
import app from "../app";
import "./io.cron.intoDB";

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

socketHandler(io);

export { server };
