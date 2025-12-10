// biome-ignore assist/source/organizeImports: false positive
import { FeedGroups, FeedPosts } from "@/server/database";
import type { PageServerLoad } from "./$types";
import { extractUsername } from "@/server/utilities/extract-username";
import { redirect } from "@sveltejs/kit";
import { resolve } from "$app/paths";

export const load: PageServerLoad = async (event) => {
	const username = await extractUsername(event);
	if (!username) {
		redirect(308, resolve("/login"));
	}

	let groups = event.locals.groups;
	if (!groups) {
		groups = (
			await FeedGroups.find({}, { sort: { visits: -1 }, limit: 20 }).toArray()
		).map((group) => ({ id: group._id.toString(), name: group.name }));
	}
	if (!groups) return;

	const groupIDs = groups.map((group) => group.id);

	const posts = await FeedPosts.find((post) => groupIDs.includes(post.group), {
		sort: { posted: -1 },
		limit: 100,
	}).toArray();
	if (posts.length === 0) return;

	return {
		posts: posts.map((post) => ({
			id: post._id.toString(),
			group: post.group,
			author: post.author,
			body: post.bodyHTML,
		})),
	};
};
