import { z } from "zod";

const createTips = z.object({
  body: z
    .object({
      title: z.string().optional(),
      link: z
        .string()
        .url({ message: "Link must be a valid URL" })
        .refine(
          (val) =>
            /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(
              val
            ),
          {
            message: "Link must be a valid YouTube video URL",
          }
        ),
      // link: z.string().url({ message: "Link must be a valid URL" }),
      platform: z
        .enum(["youtube", "google", "linkedin", "facebook"])
        .optional(),
    })
    .strict(),
});

export const tips_validation = {
  createTips,
};
