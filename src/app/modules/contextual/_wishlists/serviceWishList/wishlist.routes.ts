import { Router } from "express";

import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { WishList_controller } from "./wishlist.controller";
import { wishList_validation } from "./wishlist.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(wishList_validation.createWishListSchema),
  WishList_controller.createWishList
);

router.get("/", auth(USER_ROLE.USER), WishList_controller.getMyWishList);
router.delete("/:id", auth(USER_ROLE.USER), WishList_controller.deleteWishList);

export const serviceWishList_routes = router;
