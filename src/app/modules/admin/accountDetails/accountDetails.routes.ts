import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { accountDetailsController } from "./accountDetails.controller";

const router = Router();

router.get("/", auth(USER_ROLE.ADMIN), accountDetailsController.getUserInfo);

router.delete(
  "/delete-user/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  accountDetailsController.deleteUser
);

export const accountDetailsRoute = router;
