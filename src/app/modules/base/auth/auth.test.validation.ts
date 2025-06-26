import { z } from "zod";

const signUpValidation = z
  .object({
    // email: z
    //   .string()
    //   .email({ message: "Please provide a valid email address." }),
    profilePicture: z.string({
      required_error: "Profile picture URL is required.",
    }),
    // name: z.string({ required_error: "Name is required." }),
    // location: z.string().optional(),
    // password: z.string({ required_error: "Password is required." }),
    // isActive: z.boolean().optional(),
  })
  .strict();

export const AuthValidations = {
  signUpValidation,
};
