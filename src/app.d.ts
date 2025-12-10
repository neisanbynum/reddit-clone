// See https://svelte.dev/docs/kit/types#app.d.ts

import type { GroupIdentifier } from "@/context/app.svelte";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authenticated: boolean;
			username?: string;
			groups?: Array<GroupIdentifier>;
			recents?: Array<GroupIdentifier>;
		}
		// interface PageData {}
		interface PageState {
			redirectTo?: string;
		}
		// interface Platform {}
	}
}

export {};
