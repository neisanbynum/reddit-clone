import { NewDateSchema, UsernameSchema } from '$remote/shared.schema'
import z from 'zod/v4'

export const BlogPostSchema = z.object({
    posted: NewDateSchema({ message: "Invalid Blog Post Date" }),
    revised: NewDateSchema({ message: "Invalid Blog Post Revision Date" }),
    username: UsernameSchema,
    title: z.string().min(10, "Blog Post Title Must Be At Least 10 Characters"),
    desc: z.string().min(100, "Blog Post Description Must Be At Least 100 Characters"),
    body: z.string().min(100, "Blog Post Must Be At Least 100 Characters")
})
export type BlogPostSchema = typeof BlogPostSchema;

export const SubmitBlogPostSchema = BlogPostSchema.omit({ username: true })
export type SubmitBlogPostSchema = typeof SubmitBlogPostSchema
