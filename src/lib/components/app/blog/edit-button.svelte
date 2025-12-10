<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { getUsername } from '$remote/auth.remote';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getAppContext } from '@/context/app.svelte';

	type EditButtonProperties = {
		author?: string;
		id: string;
	};

	let { author, id }: EditButtonProperties = $props();
	const app = getAppContext()
</script>

{#if app.username === author}
	<Button class="w-18" size="sm" onclick={() => goto(resolve('/blog/[id]/edit', { id }))}>
		Edit
	</Button>
{/if}
