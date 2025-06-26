import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";

import auth from "../../../core/middlewares/auth";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
import validateRequest from "../../../core/middlewares/validateRequest";

import { AwsUploadMultiple } from "../../../core/middlewares/imageUploadHelper/awsUpload.multiple";
import { chatController } from "./chat.controller";
import { chatValidator } from "./chat.validation";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  // validateRequest(chatValidator.getChatSchema),
  chatController.getMyChat
);

router.get(
  "/partners",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  chatController.getMyPartners
);

router.post(
  "/send-images",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  upload.fields([{ name: "images", maxCount: 5 }]),
  validateRequest(chatValidator.addImages),
  AwsUploadMultiple("images"),
  chatController.sendImages
);

export const chatRouter = router;
