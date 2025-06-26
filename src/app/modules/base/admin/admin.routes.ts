import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/", auth(USER_ROLE.ADMIN), adminController.getAdmin);

export const adminRoute = router;
