import { z } from "zod";

export const userSignUpSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password is too small. It should contain at least 8 letters."),
  name: z.string().min(2, "Full name should contain at least 2 letters."),
});

export type UserSignUpSchemaType = z.infer<typeof userSignUpSchema>;

export const userSignInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password is too small. It should contain at least 8 letters."),
});

export type UserSignInSchemaType = z.infer<typeof userSignInSchema>;
