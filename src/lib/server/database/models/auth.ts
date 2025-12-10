import { type Data, Model } from "@neisanworks/neisan-mongo";
import { compare } from "bcrypt";
import mongo from "mongodb";
import z from "zod/v4";
import { PASSWORD_PEPPER } from "$env/static/private";
import { NameSchema, UsernameSchema } from "$remote/shared.schema";
import { AuthoritySchema, PermissionSchema } from "$remote/auth.schema";

export const UserSchema = z.object({
	email: z.email("Invalid User Email Address"),
	username: z
		.string()
		.trim()
		.regex(/^[a-zA-Z][a-zA-z0-9_]{7,}$/),
	password: z.coerce.string().length(60, "User Password Not Hashed"),
	attempts: z.number().min(0, "User Auth Attempts Must Be GTE 0").default(0),
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
	prefermiddle: z.boolean("Invalid Profile Prefer Middle Parameter").default(false),
	username: z
		.string()
		.trim()
		.regex(/^[a-zA-Z][a-zA-z0-9_]{7,}$/),
	groups: z.set(z.string()).default(new Set()),
	recents: z.array(z.string().nonempty()).default([]),
});
export type ProfileSchema = typeof ProfileSchema;

export class ProfileModel extends Model<ProfileSchema> {
	last!: string;
	first!: string;
	middle?: string | null | undefined;
	prefermiddle!: boolean;
	username!: string;
	groups!: Set<string>;
	recents!: Array<string>;

	constructor(data: Data) {
		super(ProfileSchema);
		this.hydrate(data);
	}

	get name(): string {
		if (this.prefermiddle && this.middle) return `${this.middle} ${this.last}`;
		return `${this.first} ${this.last}`;
	}

	addRecent(id: string) {
		if (this.recents.includes(id)) {
			const index = this.recents.indexOf(id);
			if (index !== this.recents.length - 1) {
				this.recents.splice(index, 1);
				this.recents.push(id);
			}
		} else {
			this.recents.splice(0, 1);
			this.recents.push(id);
		}
	}
}

export const SiteManagerSchema = z.object({
	username: UsernameSchema,
	permissions: z.map(PermissionSchema, AuthoritySchema).default(new Map()),
});
export type SiteManagerSchema = typeof SiteManagerSchema;

export class SiteManagerModel extends Model<SiteManagerSchema> {
	username!: string;
	permissions!: Map<z.infer<PermissionSchema>, z.infer<AuthoritySchema>>;

	constructor(data: Data) {
		super(SiteManagerSchema);
		this.hydrate(data);
	}
}
