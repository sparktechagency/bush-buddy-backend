import { z } from "zod";
import { objectId } from "../../../../common/helpers/zod.helper";

const createWishListSchema = z.object({
  body: z
    .object({
      itemId: objectId,
    })
    .strict(),
});

export const wishList_validation = {
  createWishListSchema,
};
