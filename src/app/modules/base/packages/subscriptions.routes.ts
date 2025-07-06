import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { subscriptionsController } from "./subscriptions.controller";
import { subscriptionsValidator } from "./subscriptions.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(subscriptionsValidator.createSubscriptionSchema),
  subscriptionsController.createSubscription
);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest(subscriptionsValidator.updateSubscriptionSchema),
  subscriptionsController.updateSubscription
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  subscriptionsController.getSubscription
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  subscriptionsController.deleteSubscription
);

router.post(
  "/pay/:subId",
  auth(USER_ROLE.USER),
  subscriptionsController.paymentASubscription
);

router.get(
  "/success-api-stripe/success",
  subscriptionsController.paymentSuccessStripe
);
// router.get(
//   "/success-api-stripe/cancel",
//   subscriptionsController.paymentSuccessStripe
// );

export const subscriptionsRouter = router;
