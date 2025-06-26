import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";

import auth from "../../../core/middlewares/auth";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
import validateRequest from "../../../core/middlewares/validateRequest";

import { AwsUploadMultiple } from "../../../core/middlewares/imageUploadHelper/awsUpload.multiple";
import { advertiseController } from "./advertise.controller";
import { advertiseValidator } from "./advertise.validation";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLE.USER),
  upload.fields([{ name: "photos", maxCount: 5 }]),
  validateRequest(advertiseValidator.createAdvertise),
  AwsUploadMultiple("photos"),
  advertiseController.createAdvertise
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  advertiseController.deleteAdvertise
);
router.patch(
  "/approve/:id",
  auth(USER_ROLE.ADMIN),
  advertiseController.approveAddsByAdmin
);
router.patch(
  "/reject/:id",
  auth(USER_ROLE.ADMIN),
  advertiseController.rejectAddsByAdmin
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  advertiseController.getAdvertise
);

router.get(
  "/get-my-advertise",
  auth(USER_ROLE.USER),
  advertiseController.getMyAdvertise
);

export const advertiseRouter = router;
