import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { friend_controller } from "./friend.controller";
import { friend_validation } from "./friend.validation";

const router = Router();

// ✅ friend someone
router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(friend_validation.createFriendValidation),
  friend_controller.createFriend
);

// ✅ Get my friends
router.get("/friends", auth(USER_ROLE.USER), friend_controller.getMyFriends);

// ✅ Unfriend someone by ID
router.delete("/:id", auth(USER_ROLE.USER), friend_controller.deletefriend);

export const friend_routes = router;
