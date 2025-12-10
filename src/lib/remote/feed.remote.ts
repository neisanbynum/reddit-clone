// biome-ignore assist/source/organizeImports: false positive
import { command, getRequestEvent } from "$app/server";
import { extractUsername } from "@/server/utilities/extract-username";
import { CreateFeedGroupSchemaForm } from "./feed.schema";
import { error } from "@sveltejs/kit";
import { FeedGroups, Profiles } from "@/server/database";

export const createFeedGroup = command(CreateFeedGroupSchemaForm, async (data) => {
	const event = getRequestEvent();
	const username = await extractUsername(event);
	if (!username) {
		error(409, "User Not Authenticated");
	}

	const profile = await Profiles.findOne({ username })
	if (!profile) {
		event.cookies.delete('session', { path: '/', secure: false })
		error(409, "Failed To Find User Profile")
	}

	const group = await FeedGroups.insert({ ...data, owner: username });
	if (!group.acknowledged) {
		error(500, Object.values(group.errors).at(0) ?? "Failed to Create Group");
	}
	const groupID = group.model._id.toString()

	await Profiles.updateOne(profile._id, (profile) => {
		profile.groups.add(groupID);
	})

	return { message: "Neisan-Reddit Group Created", id: groupID };
});
