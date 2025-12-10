import z from "zod/v4";

export const IDSchema = z.coerce
	.string("Invalid Database Record ID Value Type")
	.nonempty("Database Record ID Required");
export const DataPageSchema = z
	.number("Invalid Page Number Value Type")
	.min(0, "Page Number Must Be >= 0")
	.default(0);

export const UsernameSchema = z
	.string()
	.trim()
	.regex(/^[a-zA-z0-9_]{8,}$/);

export const NameSchema = z
	.string("Name Must Be Alphabetical")
	.min(2, "Name Must Be At Least 2 Characters")
	.trim();

export const EmailSchema = z.email("Invalid Email Address").trim();

export const NewDateSchema = (params: { message?: string; def?: Date } = {}) => {
	return z.coerce
		.date(params.message ?? "Invalid Date")
		.default(() => params.def ?? new Date());
};

export const TitleSchema = z
	.string("Invalid Title Value Type")
	.min(20, "Title Must Be >= 20 Characters");
export type TitleSchema = typeof TitleSchema;

export const DescriptionSchema = z
	.string("Invalid Descriptiong Value Type")
	.min(30, "Description Must Be >= 30 Characters");
export type DescriptionSchema = typeof DescriptionSchema;

export const PostBodySchema = z
	.string("Invalid Post Body Value Type")
	.min(100, "Post Body Must Be >= 100 Characters");
export type PostBodySchema = typeof PostBodySchema;
