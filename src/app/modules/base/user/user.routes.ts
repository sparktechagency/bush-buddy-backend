import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../core/middlewares/imageUploadHelper/awsUpload.single";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
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
  upload.single("profileImage"),
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  validateRequest(userValidator.updateUserValidationSchema),
  AwsUploadSingle("profileImage"),
  userController.updateMe
);

router.get("/", auth(USER_ROLE.USER, USER_ROLE.ADMIN), userController.getUser);

router.get(
  "/get-me",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  userController.getMe
);

router.put("/block-user/:id", auth(USER_ROLE.ADMIN), userController.blockUser);


export const userRoute = router;
