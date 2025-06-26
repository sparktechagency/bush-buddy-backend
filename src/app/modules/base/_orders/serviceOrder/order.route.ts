import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { order_controller } from "./order.controller";
import { order_validation } from "./order.validation";

const router = Router();

// ✅ Create Order
router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(order_validation.createOrderSchema),
  order_controller.createOrder
);

// ✅ Get All Orders
router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER), // Both admin/user can view
  order_controller.getAllOrders
);

// ✅ Get Single Order
router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  order_controller.getSingleOrder
);

// ✅ Update Order
router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN), // Only admin can update
  validateRequest(order_validation.updateOrderSchema),
  order_controller.updateOrder
);

// ✅ Delete Order
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN), // Only admin can delete
  order_controller.deleteOrder
);

export const service_order_route = router;
