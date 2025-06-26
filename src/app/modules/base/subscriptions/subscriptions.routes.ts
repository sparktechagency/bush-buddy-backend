import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { subscriptionsController } from "./subscriptions.controller";
import { subscriptionsValidator } from "./subscriptions.validation";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLE.USER),
  validateRequest(subscriptionsValidator.createSubscriptionSchema),
  subscriptionsController.createSubscription
);

export const subscriptionsRouter = router;
