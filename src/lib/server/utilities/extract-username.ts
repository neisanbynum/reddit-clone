// biome-ignore assist/source/organizeImports: false positive
import { SESSION_COOKIE_KEY } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";
import * as jose from "jose";

type RequestEvent = Parameters<Handle>[0]["event"];
export async function extractUsername(event: RequestEvent): Promise<string | undefined> {
	const unauthenticated = () => {
		event.cookies.delete("session", { path: "/", secure: false });
		event.locals.authenticated = false;
		event.locals.username = undefined;
		event.locals.groups = undefined;
		event.locals.recents = undefined;
		return undefined;
	};

	const client = event.getClientAddress();
	const cookie = event.cookies.get("session");

	if (!cookie) return unauthenticated();

	const secret = jose.base64url.decode(SESSION_COOKIE_KEY);
	const { payload } = await jose.jwtDecrypt(cookie, secret);

	if (client !== payload.client) {
		return unauthenticated();
	}

	if (typeof payload.username !== "string") {
		return unauthenticated();
	}

	const expires = new Date(Date.now() + 1000 * 60 * 60);
	const token = await new jose.EncryptJWT({
		username: payload.username,
		client: event.getClientAddress(),
	})
		.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
		.setIssuedAt()
		.setExpirationTime(expires)
		.encrypt(secret);

	event.cookies.set("session", token, {
		sameSite: false,
		expires,
		path: "/",
		secure: false,
	});

	event.locals.authenticated = true;
	event.locals.username = payload.username;

	return payload.username;
}
