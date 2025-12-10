import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import mongo from 'mongodb'
import { resolve } from "$app/paths";
import { extractUsername } from "@/server/utilities/extract-username";
import { BlogPosts } from "@/server/database";

export const load: PageServerLoad = async (event) => {
    const username = await extractUsername(event)
    if (!username) {
        redirect(307, resolve('/login'))
    }

    const id = new mongo.ObjectId(event.params.id)

    const post = await BlogPosts.findOne(id)
    if (!post || post.username !== username) {
        return history.back()
    }

    return post.toJSON()
}
