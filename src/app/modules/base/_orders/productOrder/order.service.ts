/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { startSession } from "mongoose";
import AppError from "../../../../core/error/AppError";
import { IProduct } from "../../../contextual/product/product.interface";
import { Product } from "../../../contextual/product/product.model";
import { IProductOrder } from "./order.interface";
import { ProductOrder } from "./order.model";

// ✅ Create Order
export const createOrder = async (payload: Partial<IProductOrder>) => {
  if (!payload.product) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product ID is required.");
  }

  const product: Partial<IProduct> | null = await Product.findOne({
    _id: payload.product,
    isDeleted: false,
    status: "active",
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }

  if (
    payload.quantity &&
    (typeof payload.quantity !== "number" ||
      payload.quantity <= 0 ||
      (typeof product.stock === "number" && payload.quantity > product.stock))
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid quantity or insufficient stock."
    );
  }

  payload.sellerId = product.owner;

  if (typeof product.price !== "number") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product price is invalid or missing."
    );
  }

  payload.totalPrice = product.price * (payload.quantity || 1);

  const session = await startSession();
  session.startTransaction();

  try {
    const newOrder = await ProductOrder.create([payload], { session });

    await Product.findByIdAndUpdate(
      payload.product,
      { $inc: { stock: -(payload.quantity ?? 1) } },
      { session }
    );

    await session.commitTransaction();
    return newOrder[0]; // because create with array returns array
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || "Failed to create order."
    );
  } finally {
    session.endSession();
  }
};

// ✅ Get All Orders (with optional filter)
export const getOrders = async (filter: Record<string, unknown> = {}) => {
  const orders = await ProductOrder.find({ ...filter, isDeleted: false })
    .populate("product")
    .populate("user", "name email")
    .populate("sellerId", "name email");
  return orders;
};

// ✅ Get Single Order
export const getSingleOrder = async (id: string) => {
  const order = await ProductOrder.findOne({ _id: id, isDeleted: false })
    .populate("product")
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
  payload: Partial<IProductOrder>
) => {
  const updatedOrder = await ProductOrder.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  )
    .populate("product")
    .populate("user", "name email")
    .populate("sellerId", "name email");

  if (!updatedOrder) {
    throw new Error("Order not found or already deleted.");
  }

  return updatedOrder;
};

// ✅ Delete Order (soft delete)
export const deleteOrder = async (id: string) => {
  const deletedOrder = await ProductOrder.findOneAndUpdate(
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
