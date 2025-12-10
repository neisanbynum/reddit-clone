<script lang="ts">
	import { cn } from '@/utils';
	import Button from '@/components/ui/button/button.svelte';
	import EditButton from '@components/blog/edit-button.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex h-full w-full max-w-340 flex-col gap-4">
	<div class="flex h-fit w-full justify-end gap-2">
		<Button size="sm" class="w-18" onclick={() => history.back()}>Back</Button>
		{#if data.id}
			<EditButton id={data.id} author={data.author} />
		{/if}
	</div>
	<div
		class={cn(
			'prose prose-neutral dark:prose-invert',
			'h-full w-full max-w-340 flex-col overflow-x-hidden overflow-y-auto p-4',
			'rounded-lg border border-input shadow-xs',
			'bg-background **:my-4',
			!data.html && 'justify-center items-center'
		)}
	>
		{#if data.html}
			{@html data.html}
		{:else}
			<p>Failed to Load Blog Post</p>
		{/if}
	</div>
</div>
