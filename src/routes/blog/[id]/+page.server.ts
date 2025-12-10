import type { PageServerLoad } from "./$types";
import { BlogPosts } from "@/server/database";
import mongo from 'mongodb'

export const load: PageServerLoad = async (event) => {
    const id = new mongo.ObjectId(event.params.id)

    const post = await BlogPosts.findOne(id)
    if (post) {
        return { id: event.params.id, author: post.username, html: post.makeHTML('full') }
    }
}
