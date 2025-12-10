import { FeedGroups, Profiles } from "@/server/database";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	const username = event.locals.username;
	if (username && !event.locals.recents) {
		const profile = await Profiles.findOne({ username });
		if (!profile) {
			event.locals.authenticated = false;
			event.locals.username = undefined;
			return event.locals;
		}

		const groups = await FeedGroups.findMany((group) => group.includes(username));
		event.locals.groups = groups?.map((group) => ({ name: group.name, id: group._id.toString() }));
		event.locals.recents = event.locals.groups?.filter(({ id }) =>
			profile.recents.includes(id),
		);

		await Profiles.updateOne(profile._id, (profile) => {
			profile.recents = event.locals.recents?.map(({ id }) => id) ?? [];
		});
	}

	return event.locals;
};
