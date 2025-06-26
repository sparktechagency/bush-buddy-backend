import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { follow_controller } from "./follow.controller";
import { follow_validation } from "./follow.validation";

const router = Router();

// ✅ Follow someone
router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(follow_validation.createFollowValidation),
  follow_controller.createFollow
);

// ✅ Get my followers
router.get(
  "/followers",
  auth(USER_ROLE.USER),
  follow_controller.getMyFollowers
);

// ✅ Get who I'm following
router.get(
  "/following",
  auth(USER_ROLE.USER),
  follow_controller.getMyFollowing
);

// ✅ Unfollow someone by ID
router.delete("/:id", auth(USER_ROLE.USER), follow_controller.deleteFollow);

export const follow_routes = router;
