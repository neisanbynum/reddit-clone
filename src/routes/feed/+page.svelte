<script lang="ts">
	import { Button } from '@/components/ui/button';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();
	$inspect(data);

	let page = $state<number>(0);
</script>

{#if data.posts === undefined}
	<h3 class="text-lg font-semibold">No Neisan-Reddit Groups</h3>
	<p>Be the first to create one!</p>
	<Button class="w-48" onclick={() => goto(resolve('/subneisan/create'))}>Create Group</Button>
{/if}
