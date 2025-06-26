import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { userController } from "./user.controller";
import { userValidator } from "./user.validation";

const router = Router();

router.post(
  "/",
  validateRequest(userValidator.createUserValidationSchema),
  userController.createUser
);

router.put(
  "/",
  validateRequest(userValidator.updateUserValidationSchema),
  userController.updateMe
);

router.get("/", auth(USER_ROLE.USER, USER_ROLE.ADMIN), userController.getUser);

export const userRoute = router;
