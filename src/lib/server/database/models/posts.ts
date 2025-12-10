import { Model, type Data } from "@neisanworks/neisan-mongo";
import Showdown from "showdown";
import { DateFormatter } from "@internationalized/date";
import { BlogPostSchema } from "$remote/blog.schema";
import z from "zod/v4";
import { NewDateSchema, UsernameSchema } from "@/remote/shared.schema";
import {
	FeedGroupSchema,
	FeedPostCommentSchema,
	FeedPostSchema,
} from "@/remote/feed.schema";

const converter = new Showdown.Converter();
const formatter = new DateFormatter("en-US", { dateStyle: "long" });

export class BlogPostModel extends Model<BlogPostSchema> {
	posted!: Date;
	revised!: Date;
	username!: string;
	title!: string;
	desc!: string;
	body!: string;

	constructor(data: Data) {
		super(BlogPostSchema);
		this.hydrate(data);
	}

	datestring(date: "revised" | "posted"): string {
		return formatter.format(this[date]);
	}

	get html(): string {
		return converter.makeHtml(this.body);
	}

	makeHTML(target: "title" | "desc" | "body" | "full"): string {
		switch (target) {
			case "title":
				return converter.makeHtml(`# ${this.title}`);
			case "desc":
				return converter.makeHtml(this.desc);
			case "body":
				return converter.makeHtml(this.body);
			default:
				return converter.makeHtml(
					`### Author: ${this.username}\n**Posted:** ${formatter.format(this.posted)} **Revised:** ${formatter.format(this.revised)}\n\n---\n# ${this.title}\n\n---\n${this.desc}\n\n---\n${this.body}`,
				);
		}
	}

	get fullhtml(): string {
		return converter.makeHtml(
			`### Author: ${this.username}\n**Posted:** ${formatter.format(this.posted)} **Revised:** ${formatter.format(this.revised)}\n\n---\n# ${this.title}\n\n---\n${this.desc}\n\n---\n${this.body}`,
		);
	}
}

export class FeedGroupModel extends Model<FeedGroupSchema> {
	avatar?: string;
	name!: string;
	desc!: string;
	rules!: string;
	owner!: string;
	moderators!: Set<string>;
	members!: Set<string>;
	visits!: bigint;
	created!: Date;
	lastVisit!: Date;

	constructor(data: Data) {
		super(FeedGroupSchema);
		this.hydrate(data);
	}

	includes(username: string): boolean {
		return (
			this.owner === username ||
			this.moderators.has(username) ||
			this.members.has(username)
		);
	}

	transfer(owner: string) {
		this.owner = owner;
		if (this.moderators.has(owner)) this.moderators.delete(owner);
	}

	get rulesHTML(): string {
		return converter.makeHtml(this.rules);
	}

	get abandoned(): boolean {
		return this.lastVisit < new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
	}
}

export class FeedPostModel extends Model<FeedPostSchema> {
	group!: string;
	title!: string;
	author!: string;
	posted!: Date;
	body!: string;

	constructor(data: Data) {
		super(FeedPostSchema);
		this.hydrate(data);
	}

	get titleHTML(): string {
		return converter.makeHtml(`### ${this.title}`);
	}

	get authorHTML(): string {
		return converter.makeHtml(`#### ${this.author}`);
	}

	get postedString(): string {
		return formatter.format(this.posted);
	}

	get postedHTML(): string {
		return converter.makeHtml(this.postedString);
	}

	get bodyHTML(): string {
		return converter.makeHtml(this.body);
	}
}

export class FeedPostCommentModel extends Model<FeedPostCommentSchema> {
	parent!: string;
	author!: string;
	posted!: Date;
	comment!: string;
	likes!: number;
	dislikes!: number;

	constructor(data: Data) {
		super(FeedPostCommentSchema);
		this.hydrate(data);
	}

	get postedString(): string {
		return formatter.format(this.posted);
	}

	get commentHTML(): string {
		return converter.makeHtml(this.comment);
	}
}
