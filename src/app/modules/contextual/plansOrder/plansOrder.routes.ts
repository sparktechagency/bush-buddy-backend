import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";

import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";

import { plansOrderController } from "./plansOrder.controller";
import { plansOrderValidator } from "./plansOrder.validation";

const router = Router();

router.post(
  "/purchase-plan",
  auth(USER_ROLE.USER),
  validateRequest(plansOrderValidator.plansOrderSchema),
  plansOrderController.createOrder
);

export const plansOrderRoutes = router;
