import { command } from "$app/server";
import { DataPageSchema, IDSchema } from "$remote/shared.schema";
import { BlogPosts, Users } from "@/server/database";
import { error } from "@sveltejs/kit";
import mongo from "mongodb";
import { authenticate, getUsername, logout } from "./auth.remote";
import { SubmitBlogPostSchema } from "./blog.schema";

const ObjectIDSchema = IDSchema.transform((id) => new mongo.ObjectId(id));

export const getBlogPostHTML = command(ObjectIDSchema, async (id) => {
	if (!(await authenticate())) {
		error(401, "User Not Authenticated");
	}

	const post = await BlogPosts.findOne(id);
	if (post) {
		return { username: post.username, html: post.makeHTML("full") };
	}
});

export const getBlogPost = command(ObjectIDSchema, async (id) => {
	if (!(await authenticate())) {
		error(401, "User Not Authenticated");
	}

	const post = await BlogPosts.findOne(id);
	return post ? post.toJSON() : undefined;
});

export const submitBlogPost = command(SubmitBlogPostSchema, async (data) => {
	const username = await getUsername();
	if (!username) {
		error(401, "User Not Authenticated");
	}

	const user = await Users.findOne({ username });
	if (user === null) {
		await logout();
		error(401, "User Not Authenticated");
	}

	const existing = await BlogPosts.findOne(data);
	if (existing) {
		const update = await BlogPosts.updateOne(existing._id, {
			...data,
			revised: new Date(),
		});
		if (!update.acknowledged) {
			error(500, Object.values(update.errors).at(0) ?? "Failed to Update Blog Post");
		}

		return { message: "Blog Updated", id: update.model._id.toString() };
	}

	const created = await BlogPosts.insert({ ...data, username });
	if (!created.acknowledged) {
		error(500, "Failed to Save Blog Post");
	}

	return { message: "Blog Posted", id: created.model._id.toString() };
});

export const getBlogPostPage = command(DataPageSchema, async (page) => {
	return (
		await BlogPosts.find(
			{},
			{ limit: 100, skip: (page - 1) * 100, sort: { posted: -1 } },
		).toArray()
	).map((post) => ({
		id: post._id.toString(),
		username: post.username,
		title: post.title,
		html: post.makeHTML("desc"),
		posted: post.datestring("posted"),
	}));
});
