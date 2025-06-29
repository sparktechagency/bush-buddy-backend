import { z } from "zod";
import { objectId } from "../../../common/helpers/zod.helper";

const createFriendValidation = z.object({
  body: z
    .object({
      friendId: objectId,
    })
    .strict(),
});

export const friend_validation = {
  createFriendValidation,
};
