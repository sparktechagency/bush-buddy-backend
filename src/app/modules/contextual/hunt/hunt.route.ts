import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../core/middlewares/imageUploadHelper/awsUpload.single";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
import validateRequest from "../../../core/middlewares/validateRequest";
import { hunt_controller } from "./hunt.controller";
import { hunt_validation } from "./hunt.validation";

const router = Router();

router.post(
  "/",

  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(hunt_validation.create),
  AwsUploadSingle("image"),
  hunt_controller.createHunt
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.USER), hunt_controller.getHunt);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(hunt_validation.update),
  AwsUploadSingle("image"),
  hunt_controller.updateHunt
);

export const hunt_route = router;
