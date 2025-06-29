import { z } from "zod";

const createWaypoint = z.object({
  body: z
    .object({
      name: z.string(),
      description: z.string(),
      icon: z.string(),
      photos: z.array(z.string()),
      location: z.object({
        type: z.string().refine((val) => val === "Point", {
          message: "Location type must be 'Point'",
        }),
        coordinates: z.array(z.number()).length(2),
      }),
      wether: z.object({
        sunrise: z.string(),
        cloud: z.string(),
        humidity: z.string(),
      }),
    })
    .strict(),
});

export const waypoint_validation = {
  createWaypoint,
};
