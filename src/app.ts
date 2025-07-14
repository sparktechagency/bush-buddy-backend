/* eslint-disable no-console */
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";

import { generateRouteHTML } from "./app/common/utils/home";
import globalErrorHandler from "./app/core/middlewares/globalErrorHandler";
import notFound from "./app/core/middlewares/notFound";
import router from "./routes";

const app: Express = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://victoriaade12.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://204.197.173.195:4174",
      "http://192.168.40.112:3001",
    ],
    credentials: true,
  })
);

// async function setupGraphQL(app: Express) {
//   await initializeApolloServer(app);
// }

(async () => {
  // await setupGraphQL(app);

  // API routes
  app.use(
    "/api/v1",
    (req, res, next) => {
      const now = new Date().toLocaleString().replace(/\//g, "-");
      console.info(chalk.bgYellowBright(` Hit detected at `), now);
      next();
    },
    router
  );

  generateRouteHTML();

  app.get("/", (req: Request, res: Response) => {
    res.send(generateRouteHTML());
  });

  app.get("/api/v1", (req: Request, res: Response) => {
    res.send(generateRouteHTML());
  });

  app.use(globalErrorHandler);
  app.use(notFound);
})();

export default app;
