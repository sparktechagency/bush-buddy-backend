import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { AwsUploadTuple } from "../../../core/middlewares/imageUploadHelper/aws.upload.tuple";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
import { validateImageUpload } from "../../../core/middlewares/imageUploadHelper/validateImageUpload";
import validateRequest from "../../../core/middlewares/validateRequest";
import { service_controller } from "./service.controller";
import { service_validation } from "./service.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.fields([
    { name: "featureImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validateImageUpload([
    { name: "featureImage", maxSizeMB: 5, required: true },
    { name: "images", maxSizeMB: 5, required: false },
  ]),
  validateRequest(service_validation.serviceZodSchema),
  AwsUploadTuple([
    { fieldName: "featureImage", multiple: false },
    { fieldName: "images", multiple: true },
  ]),
  service_controller.createService
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.fields([
    { name: "featureImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validateImageUpload([
    { name: "featureImage", maxSizeMB: 5, required: false },
    { name: "images", maxSizeMB: 5, required: false },
  ]),
  validateRequest(service_validation.updateServiceZodSchema),
  AwsUploadTuple([
    { fieldName: "featureImage", multiple: false },
    { fieldName: "images", multiple: true },
  ]),
  service_controller.updateService
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  service_controller.getServices
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  service_controller.getSingleServices
);

router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  service_controller.deleteService
);

export const service_route = router;
