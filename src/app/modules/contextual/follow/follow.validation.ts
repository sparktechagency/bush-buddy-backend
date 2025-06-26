import { z } from "zod";
import { objectId } from "../../../common/helpers/zod.helper";

const createFollowValidation = z.object({
  body: z
    .object({
      followedUserId: objectId,
    })
    .strict(),
});

export const follow_validation = {
  createFollowValidation,
};
