import { MongoClient } from '@neisanworks/neisan-mongo';
import { MONGO_CONNECTION_STRING } from '$env/static/private';
import { ProfileModel, ProfileSchema, UserModel, UserSchema } from './models/auth';

export const client = new MongoClient(MONGO_CONNECTION_STRING, {
	maxPoolSize: 150
});

const db = client.db('reddit-clone');

// Auth Collections
export const Users = db.collection({
	name: 'users',
	schema: UserSchema,
	model: UserModel,
	unique: ['email', 'username']
});

// Profile Collections
export const Profiles = db.collection({
	name: 'profiles',
	schema: ProfileSchema,
	model: ProfileModel,
	unique: ['username']
});
