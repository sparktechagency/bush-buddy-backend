import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { support_controller } from "./support.controller";
import { supportValidation } from "./support.validation";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLE.USER),
  validateRequest(supportValidation.createSupportSchema),
  support_controller.createSupport
);

export const supportRouter = router;
