import { command } from '$app/server';
import { PASSWORD_PEPPER } from '$env/static/private';
import { RegisterFormSchema } from '$lib/schemas/auth';
import { Profiles, Users } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { hash } from 'bcrypt';

export const register = command(
	RegisterFormSchema,
	async ({ email, username, password, confirmpassword, ...rest }) => {
		let conflict =
			(await Users.findOne((user) => user.email === email || user.username === username)) ??
			(await Profiles.findOne({ username }));
		if (conflict !== null) {
			error(409, 'Email Address Must Be Unique');
		}

		const user = await Users.insert({
			email,
			username,
			password: await hash(password + PASSWORD_PEPPER, 10)
		});
		if (!user.acknowledged) {
			console.error(user.errors);
			error(500, 'Unable to Create Account');
		}

		const profile = await Profiles.insert({ username, ...rest });
		if (!profile.acknowledged) {
			await Users.deleteOne(user.model._id);
			error(500, 'Unable to Create Account');
		}

		return { message: 'Account Successfully Created' };
	}
);
