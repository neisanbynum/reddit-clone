import { MongoClient } from '@neisanworks/neisan-mongo';
import { MONGO_CONNECTION_STRING } from '$env/static/private';
import { ProfileModel, ProfileSchema, SiteManagerSchema, SiteManagerModel, UserModel, UserSchema } from './models/auth';
import { LegalNoticeModel } from './models/legal';
import { LegalNoticeSchema } from '$remote/legal.schema';
import { BlogPostModel, FeedGroupModel, FeedPostCommentModel, FeedPostModel } from './models/posts';
import { BlogPostSchema } from '$remote/blog.schema';
import { FeedGroupSchema, FeedPostCommentSchema, FeedPostSchema } from '@/remote/feed.schema';

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

export const SiteManagers = db.collection({
	name: 'super-admin',
	schema: SiteManagerSchema,
	model: SiteManagerModel,
	unique: ['username']
})

// Legal Collections
export const LegalNotices = db.collection({
	name: 'legal-notices',
	schema: LegalNoticeSchema,
	model: LegalNoticeModel
})

// Profile Collections
export const Profiles = db.collection({
	name: 'profiles',
	schema: ProfileSchema,
	model: ProfileModel,
	unique: ['username']
});


// Post Collections
export const BlogPosts = db.collection({
	name: 'blog-posts',
	schema: BlogPostSchema,
	model: BlogPostModel
})

export const FeedGroups = db.collection({
	name: 'feed-groups',
	schema: FeedGroupSchema,
	model: FeedGroupModel,
	unique: ['name']
})

export const FeedPosts = db.collection({
	name: 'feed-posts',
	schema: FeedPostSchema,
	model: FeedPostModel,
})

export const FeedPostComments = db.collection({
	name: 'feed-post-comments',
	schema: FeedPostCommentSchema,
	model: FeedPostCommentModel
})
