import { z } from "zod";
import { objectId } from "../../../../common/helpers/zod.helper";

const createOrderSchema = z.object({
  body: z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(5),
      country: z.string().min(1),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zip: z.string().min(1),
      service: objectId,
    })
    .strict(),
});

const updateOrderSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(5).optional(),
      country: z.string().min(1).optional(),
      address: z.string().min(1).optional(),
      city: z.string().min(1).optional(),
      state: z.string().min(1).optional(),
      zip: z.string().min(1).optional(),
    })
    .strict(),
});

export const order_validation = {
  createOrderSchema,
  updateOrderSchema,
};
