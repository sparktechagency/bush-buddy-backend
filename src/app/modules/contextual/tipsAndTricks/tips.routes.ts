import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { tips_controller } from "./tips.controller";
import { tips_validation } from "./tips.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(tips_validation.createTips),
  tips_controller.createTips
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.USER), tips_controller.getTips);

export const tips_routes = router;
