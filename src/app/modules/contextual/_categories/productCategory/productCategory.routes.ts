import { Router } from "express";

import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../../core/middlewares/imageUploadHelper/awsUpload.single";
import { upload } from "../../../../core/middlewares/imageUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { categoryController } from "./productCategory.controller";
import { productCategoryValidator } from "./productCategory.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  upload.single("image"),
  validateRequest(productCategoryValidator.createCategorySchema),
  AwsUploadSingle("image"),
  categoryController.createCat
);

router.put(
  "/:catId",
  auth(USER_ROLE.ADMIN),
  upload.single("image"),
  validateRequest(productCategoryValidator.updateCategorySchema),
  AwsUploadSingle("image"),
  categoryController.updateCat
);

router.delete("/:catId", auth(USER_ROLE.ADMIN), categoryController.deleteCat);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  categoryController.getCat
);

export const productCategoryRoute = router;
