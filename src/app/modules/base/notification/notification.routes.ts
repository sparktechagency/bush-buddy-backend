import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { notificationController } from "./notification.controller";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.USER, USER_ROLE.ADMIN),
  notificationController.getAllNotification
);

router.put(
  "/make-read",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.USER),
  notificationController.makeRead
);

router.put(
  "/make-all-not-read",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.USER),
  notificationController.makeAllNotRead
);

export const notificationRoute = router;
