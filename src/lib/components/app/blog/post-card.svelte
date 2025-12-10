<script lang="ts">
	import * as Card from '@/components/ui/card';
	import { cn } from '@/utils';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	type PostCardProperties = Record<'title' | 'username' | 'posted' | 'html' | 'id', string>;

	let { title, username, id, posted, html }: PostCardProperties = $props();
</script>

<Card.Root
	class="flex dark:bg-background bg-neutral-100 gap-0 h-fit w-full cursor-pointer overflow-clip p-0"
	onclick={() => goto(resolve('/blog/[id]', { id }))}
>
	<Card.Header class="border-y py-3">
		<Card.Title>{title}</Card.Title>
		<Card.Description>{posted}</Card.Description>
		<Card.Action>
			<h4 class="font-semibold">
				Author: <span class="font-normal">{username}</span>
			</h4>
		</Card.Action>
	</Card.Header>
	<Card.Content class="p-0">
		<div
			class={cn(
				'prose prose-neutral dark:prose-invert',
				'h-fit w-full max-w-340 flex-col overflow-x-hidden overflow-y-clip p-4 py-0',
				'bg-card **:my-4'
			)}
		>
			{@html html}
		</div>
	</Card.Content>
</Card.Root>
