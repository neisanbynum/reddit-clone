import { command, getRequestEvent, query } from '$app/server';
import { Profiles, Users } from '@/server/database';
import { error } from '@sveltejs/kit';
import { LoginFormSchema, RegisterFormSchema } from './auth.schema';
import { PASSWORD_PEPPER, SESSION_COOKIE_KEY } from '$env/static/private';
import { UsernameSchema } from '$remote/shared.schema';
import * as jose from 'jose'
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

export const renewsession = command(UsernameSchema, async (username) => {
    const event = getRequestEvent();

    const secret = jose.base64url.decode(SESSION_COOKIE_KEY)
    const expires = new Date(Date.now() + (1000 * 60 * 60))
    const token = await new jose.EncryptJWT({ username, client: event.getClientAddress() })
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt()
        .setExpirationTime(expires)
        .encrypt(secret)


    event.cookies.set('session', token, {
        sameSite: false,
        expires,
        path: '/',
        secure: false
    });
})

export const login = command(LoginFormSchema, async ({ identifier, password }) => {
    const user = await Users.findOne(
        (user) => user.email === identifier || user.username === identifier
    );

    if (!user || !(await user.authenticate(password))) {
        const update = await Users.updateOne(
            (user) => user.email === identifier || user.username === identifier,
            (user) => {
                user.attempts++;
            }
        );

        if (update.acknowledged && update.model.locked) {
            error(423, 'Account Locked');
        }

        error(401, 'Invalid Credentials');
    }

    const profile = await Profiles.findOne({ username: user.username });
    if (!profile) {
        await Users.deleteOne(user._id);
        error(404, 'Account Not Found');
    }

    await renewsession(user.username)

    await Users.updateOne(user._id, (user) => (user.attempts = 0));

    return { message: `Welcome, ${profile.username}`, username: user.username };
});

export const getUsername = command(async () => {
    const event = getRequestEvent()
    const client = event.getClientAddress()
    const cookie = event.cookies.get('session')
    if (!cookie) {
        return;
    }

    const secret = jose.base64url.decode(SESSION_COOKIE_KEY)
    const { payload } = await jose.jwtDecrypt(cookie, secret)

    if (client !== payload.client) {
        return;
    }

    if (typeof payload.username !== 'string') {
        return;
    }

    await renewsession(payload.username)

    return payload.username;
})

export const authenticate = command(async () => {
    return (await getUsername()) !== undefined;
})

export const logout = command(async () => {
    getRequestEvent().cookies.delete('session', { path: '/', secure: false })
})
