<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import BlogPostCard from '@components/blog/post-card.svelte';
	import { getBlogPostPage } from '$remote/blog.remote';
	import { Button } from '@/components/ui/button';

	let page = $state(1);
	let posts = $derived(await getBlogPostPage(page));
</script>

<div class="flex w-full max-w-340 justify-end">
	<Button size="sm" onclick={() => goto(resolve('/blog/create'))}>Create Post</Button>
</div>
<div
	class="flex h-full w-full max-w-340 flex-col items-center justify-start gap-4 overflow-x-hidden overflow-y-auto"
>
	{#if posts.length > 0}
		{#each posts as post}
			<BlogPostCard {...post} />
		{/each}
	{:else}
		<h3 class="text-lg font-semibold">No Blog Posts</h3>
		<p>Be the first to post a blog!</p>
	{/if}
</div>
