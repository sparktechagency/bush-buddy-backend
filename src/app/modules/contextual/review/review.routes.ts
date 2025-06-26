import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";

import auth from "../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../core/middlewares/imageUploadHelper/awsUpload.single";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
import validateRequest from "../../../core/middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidator } from "./review.validation";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLE.USER),
  upload.single("photo"),
  validateRequest(reviewValidator.createFoodReviewSchema),
  AwsUploadSingle("photo"),
  reviewController.createReview
);

router.get(
  "/private-feedback",
  auth(USER_ROLE.USER),
  reviewController.getPrivateFeedback
);

router.get("/get-tips", reviewController.getTips);

router.get(
  "/get-your-review",
  auth(USER_ROLE.USER),
  reviewController.getYourBuyerReview
);

router.put("/accept/:reviewId", reviewController.acceptReview);

router.get(
  "/buyer-review",
  auth(USER_ROLE.USER),
  reviewController.getReviewByBuyerId
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  reviewController.getReviewBySellerId
);

export const reviewRouter = router;
