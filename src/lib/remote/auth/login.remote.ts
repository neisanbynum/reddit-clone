import { error } from "@sveltejs/kit";
import { command, getRequestEvent } from "$app/server";
import { Profiles, Users } from '$lib/server/database';
import { LoginFormSchema } from "$lib/schemas/auth";
import { CookieExpiration, encrypt } from "$lib/server/utilities";

export const login = command(LoginFormSchema, async ({ email, password }) => {
  const user = await Users.findOne({ email });

  if (!user || !(await user.authenticate(password))) {
    const update = await Users.updateOne({ email }, (user) => {
      user.attempts++;
    });

    if (update.acknowledged && update.model.locked) {
      error(423, "Account Locked");
    }

    error(401, "Invalid Email/Password");
  }

  const profile = await Profiles.findOne({ username: user.username });
  if (!profile) {
    await Users.deleteOne(user._id);
    error(404, "Account Not Found");
  }

  const event = getRequestEvent();

  const cookie = {
    email: user.email,
    client: event.getClientAddress(),
    expires: CookieExpiration(),
  };

  const encrypted = encrypt(JSON.stringify(cookie));

  event.cookies.set("session", encrypted, {
    sameSite: false,
    expires: CookieExpiration(),
    path: "/",
    secure: false,
  });

  await Users.updateOne(user._id, (user) => (user.attempts = 0));

  return { message: `Welcome, ${profile.name}` };
});
