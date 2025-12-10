// biome-ignore assist/source/organizeImports: false positive
import z from "zod/v4";
import {
	UsernameSchema,
	NewDateSchema,
	TitleSchema,
	PostBodySchema,
	IDSchema,
	DescriptionSchema,
} from "./shared.schema";

export const FeedGroupSchema = z.object({
	avatar: z.string().nonempty().optional(),
	name: UsernameSchema,
	desc: DescriptionSchema.or(
		z.literal("", "Description Must Be >= 30 Characters"),
	).default(""),
	rules: z
		.string()
		.min(30, "Rules Must Be >= 30 Characters")
		.or(z.literal("", "Rules Must Be >= 30 Characters"))
		.default(""),
	owner: UsernameSchema,
	moderators: z.set(UsernameSchema).default(new Set()),
	members: z.set(UsernameSchema).default(new Set()),
	visits: z.bigint().default(0n),
	created: NewDateSchema({ message: "Invalid SubGroup Creation Date" }),
	lastVisit: NewDateSchema({ message: "Invalid Neisan-SubReddit Last Visit Date" }),
});
export type FeedGroupSchema = typeof FeedGroupSchema;

export const CreateFeedGroupSchemaForm = FeedGroupSchema.pick({
	avatar: true,
	name: true,
	desc: true,
	rules: true,
});
export type CreateFeedGroupSchemaForm = typeof CreateFeedGroupSchemaForm;

export const FeedPostSchema = z.object({
	group: IDSchema,
	title: TitleSchema,
	author: UsernameSchema,
	posted: NewDateSchema({ message: "Invalid Feed Post Date" }),
	body: PostBodySchema,
});
export type FeedPostSchema = typeof FeedPostSchema;

export const FeedPostCommentSchema = z.object({
	parent: IDSchema,
	author: UsernameSchema,
	posted: NewDateSchema({ message: "Invalid Feed Post Comment Date" }),
	comment: z
		.string("Invalid Feed Post Comment")
		.min(5, "Feed Post Comment Must Be >= 5 Characters"),
	likes: z.coerce.number("Feed Post Comment Likes Must Be >= 0").default(0),
	dislikes: z.coerce.number("Feed Post Comment Dislikes Must Be >= 0").default(0),
});
export type FeedPostCommentSchema = typeof FeedPostCommentSchema;
