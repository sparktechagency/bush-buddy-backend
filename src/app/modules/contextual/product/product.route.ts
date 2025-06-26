import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";

import auth from "../../../core/middlewares/auth";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
import validateRequest from "../../../core/middlewares/validateRequest";

import { AwsUploadTuple } from "../../../core/middlewares/imageUploadHelper/aws.upload.tuple";
import { validateImageUpload } from "../../../core/middlewares/imageUploadHelper/validateImageUpload";
import { product_controller } from "./product.controller";
import { product_validation } from "./product.validation";

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
  validateRequest(product_validation.productZodSchema),
  AwsUploadTuple([
    { fieldName: "featureImage", multiple: false },
    { fieldName: "images", multiple: true },
  ]),
  product_controller.createProduct
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
  validateRequest(product_validation.updateProductZodSchema),
  AwsUploadTuple([
    { fieldName: "featureImage", multiple: false },
    { fieldName: "images", multiple: true },
  ]),
  product_controller.updateProduct
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  product_controller.getProducts
);
router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  product_controller.getSingleProducts
);

router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  product_controller.deleteProduct
);

export const product_route = router;
