<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { getUsername } from "$remote/auth.remote"
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

    type EditButtonProperties = {
        author?: string;
        id: string;
    }

	let { author, id }: EditButtonProperties = $props();

	const username = $state(await getUsername());
</script>

{#if username === author}
	<div class="flex h-fit w-full justify-end">
		<Button class="w-18" size="sm" onclick={() => goto(resolve('/blog/[id]/edit', { id }))}>Edit</Button>
	</div>
{/if}
