import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { hunt_controller } from "./hunt.controller";
import { hunt_validation } from "./hunt.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(hunt_validation.create),
  hunt_controller.createHunt
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.USER), hunt_controller.getHunt);

export const hunt_route = router;
