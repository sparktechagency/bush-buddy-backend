import { z } from "zod";

const createSos = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required"),
      phone: z.string().min(10, "Phone number is required"),
      email: z.string().optional(),
    })
    .strict(),
});

const updateSos = z.object({
  body: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
    })
    .strict(),
});

export const sos_validation = {
  createSos,
  updateSos,
};
