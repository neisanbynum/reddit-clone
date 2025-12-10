import type { HandleClientError } from "@sveltejs/kit";

export const handle: HandleClientError = async ({ error, event, status }) => {
    console.log({ error, event, status })
    if (status === 401 && event.route.id !== '/login') {

        event.route.id = '/login'
    }
}
