import z from "zod/v4";
import { EmailSchema, NameSchema, UsernameSchema } from "./shared";

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: z.coerce
    .string("Password Must Be Alpha-Numeric")
    .min(8, "Password Must Be At Least 8 Characters"),
});

export const RegisterFormSchema = z
  .object({
    last: NameSchema,
    first: NameSchema,
    middle: NameSchema.nullish(),
    prefermiddle: z.boolean().default(false),
    username: UsernameSchema,
    email: EmailSchema,
    password: z
      .string("Password Must Be Alpha-Numeric")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,24}$/
      ),
    confirmpassword: z.string("Password Must Be Alpha-Numeric"),
  })
  .refine(({ password, confirmpassword }) => password === confirmpassword, {
    path: ["confirmpassword"],
    abort: false,
    message: "Does Not Match Password",
  });

export const SessionCookieSchema = z.object({
  username: UsernameSchema,
  client: z.coerce.string("Invalid Session Cookie Client Address"),
  expires: z.coerce.date("Invalid Session Cookie Expiration Date"),
});
