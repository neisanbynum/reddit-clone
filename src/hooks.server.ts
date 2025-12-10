import type { ResolvedPathname } from "$app/types";
import { extractUsername } from "@/server/utilities/extract-username";
import { redirect, type Handle } from "@sveltejs/kit";

const secured = new Set<ResolvedPathname>(["/feed", "/site-management", '/subneisan']);
export const handle: Handle = async ({ event, resolve }) => {
	const username = await extractUsername(event);
	if (!username) {
		const curr = event.route.id;
		if (!curr) return resolve(event)

		if (secured.has(curr)) redirect(308, '/login')
		for (const route of secured) {
			if (event.route.id?.startsWith(route)) redirect(308, "/login");
		}
	}

	if (event.route.id === "/login") return resolve(event);

	return resolve(event);
};
