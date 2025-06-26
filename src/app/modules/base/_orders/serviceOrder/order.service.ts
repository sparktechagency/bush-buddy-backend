import { IService } from "../../../contextual/service/service.interface";
import { Service } from "../../../contextual/service/service.model";
import { IServiceOrder } from "./order.interface";
import { ServiceOrder } from "./order.model";

// Create Order Service
const createOrder = async (payload: Partial<IServiceOrder>) => {
  // Step 1: Validate required fields (if not using Zod before this)
  if (!payload.service) {
    throw new Error("service ID is required to place an ServiceOrder.");
  }

  // Step 2: Populate service and get sellerId
  const service: Partial<IService> | null = await Service.findOne().where({
    _id: payload.service,
    isDeleted: false,
    status: "active",
  });

  if (!service) {
    throw new Error("service not found.");
  }

  payload.sellerId = service.owner;
  if (typeof service.price !== "number") {
    throw new Error("service price is missing or invalid.");
  }
  payload.totalPrice = service.price * (payload.quantity || 1);

  const newOrder = await ServiceOrder.create(payload);
  return newOrder;
};

// ✅ Get All Orders (with optional filter)
export const getOrders = async (filter: Record<string, unknown> = {}) => {
  const orders = await ServiceOrder.find({ ...filter, isDeleted: false })
    .populate("service")
    .populate("user", "name email")
    .populate("sellerId", "name email");
  return orders;
};

// ✅ Get Single Order
export const getSingleOrder = async (id: string) => {
  const order = await ServiceOrder.findOne({ _id: id, isDeleted: false })
    .populate("service")
    .populate("user", "name email")
    .populate("sellerId", "name email");

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
};

// ✅ Update Order
export const updateOrder = async (
  id: string,
  payload: Partial<IServiceOrder>
) => {
  const updatedOrder = await ServiceOrder.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  )
    .populate("service")
    .populate("user", "name email")
    .populate("sellerId", "name email");

  if (!updatedOrder) {
    throw new Error("Order not found or already deleted.");
  }

  return updatedOrder;
};

// ✅ Delete Order (soft delete)
export const deleteOrder = async (id: string) => {
  const deletedOrder = await ServiceOrder.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!deletedOrder) {
    throw new Error("Order not found or already deleted.");
  }
};

export const order_service = {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
