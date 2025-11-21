import { command, getRequestEvent } from "$app/server";
import { SessionCookieSchema } from '$lib/schemas/auth';
import { Profiles, Users } from '$lib/server/database';
import { CookieExpiration, decrypt, encrypt } from "$lib/server/utilities";

export const getUser = command(async () => {
  const event = getRequestEvent();
  const cookie = event.cookies.get("session");
  if (!cookie) return;

  const decrypted = JSON.parse(decrypt(cookie));
  const parsed = await SessionCookieSchema.safeParseAsync(decrypted);
  if (!parsed.success) return;

  const user = await Users.findOne({ username: parsed.data.username });
  if (!user) return;

  const encrypted = encrypt(
    JSON.stringify({
      username: user.username,
      client: event.getClientAddress(),
      expires: CookieExpiration(),
    })
  );

  event.cookies.set("session", encrypted, {
    sameSite: false,
    expires: CookieExpiration(),
    path: "/",
    secure: false,
  });

  return user;
});

export const authenticated = command(async () => {
  return (await getUser()) !== undefined;
});

export const logout = command(async () => {
  const event = getRequestEvent();
  const cookie = event.cookies.get("session");
  if (!cookie) {
    return { message: "User Not Signed In" };
  }

  const decrypted = JSON.parse(decrypt(cookie));
  const parsed = await SessionCookieSchema.safeParseAsync(decrypted);
  if (!parsed.success) {
    return { message: "User Not Signed In" };
  }

  const profile = await Profiles.findOne({ username: parsed.data.username });

  event.cookies.delete("session", { path: "/" });

  return {
    message: profile ? `Goodbye, ${profile.name}` : "Successfully Logged Out",
  };
});
