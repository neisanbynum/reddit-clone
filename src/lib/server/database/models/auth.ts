import { type Data, Model } from '@neisanworks/neisan-mongo';
import { compare } from 'bcrypt';
import mongo from "mongodb"
import z from 'zod/v4';
import { PASSWORD_PEPPER } from '$env/static/private';
import { NameSchema } from '$lib/schemas/shared';

export const UserSchema = z.object({
	email: z.email('Invalid User Email Address'),
	username: z
		.string()
		.trim()
		.regex(/^[a-zA-Z][a-zA-z0-9_]{7,}$/),
	password: z.coerce.string().length(60, 'User Password Not Hashed'),
	attempts: z.number().min(0, 'User Auth Attempts Must Be GTE 0').default(0)
});
export type UserSchema = typeof UserSchema;

export class UserModel extends Model<UserSchema> {
	email!: string;
	username!: string;
	password!: string;
	attempts!: number;

	constructor(data: Data) {
		super(UserSchema);
		this.hydrate(data);
	}

	get locked(): boolean {
		return this.attempts >= 3;
	}

	async authenticate(password: string): Promise<boolean> {
		return compare(password + PASSWORD_PEPPER, this.password);
	}
}

export const ProfileSchema = z.object({
	last: NameSchema,
	first: NameSchema,
	middle: NameSchema.nullish(),
	prefermiddle: z.boolean('Invalid Profile Prefer Middle Parameter').default(false),
	username: z
		.string()
		.trim()
        .regex(/^[a-zA-Z][a-zA-z0-9_]{7,}$/),
    groups: z.set(z.instanceof(mongo.ObjectId)).default(new Set())
});
export type ProfileSchema = typeof ProfileSchema;

export class ProfileModel extends Model<ProfileSchema> {
	last!: string;
	first!: string;
	middle?: string | null | undefined;
	prefermiddle!: boolean;
	username!: string;
    groups!: Set<mongo.ObjectId>

	constructor(data: Data) {
		super(ProfileSchema);
		this.hydrate(data);
	}

	get name(): string {
		if (this.prefermiddle && this.middle) return `${this.middle} ${this.last}`;
		return `${this.first} ${this.last}`;
	}
}
