import z from 'zod/v4'

export const UsernameSchema = z
        .string()
        .trim()
        .regex(/^[a-zA-Z][a-zA-z0-9_]{7,}$/)
export const NameSchema = z.string("Name Must Be Alphabetical").min(2, "Name Must Be At Least 2 Characters").trim()
export const EmailSchema = z.email("Invalid Email Address").trim()
