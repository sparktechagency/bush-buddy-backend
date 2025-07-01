import { z } from "zod";
import { locationSchema } from "../../../common/helpers/zod.helper";

const create = z.object({
  body: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      location: locationSchema,
    })
    .strict(),
});

export const hunt_validation = {
  create,
};
