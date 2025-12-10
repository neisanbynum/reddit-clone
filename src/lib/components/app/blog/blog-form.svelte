<script lang="ts">
	import * as Tabs from '@/components/ui/tabs';
	import { useForm } from '@/utilities/useForm.svelte';
	import { cn } from '@/utils';
	import Textarea from '@/components/custom/textarea.svelte';
	import Showdown from 'showdown';
	import Input from '@/components/custom/input.svelte';
	import Submit from '@/components/custom/submit.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import z from 'zod/v4';
	import { submitBlogPost } from '$remote/blog.remote';
	import { SubmitBlogPostSchema } from '$remote/blog.schema';
	import { Button } from '@/components/ui/button';

	const PartialBlogPostSchema = SubmitBlogPostSchema.partial()
	type FormProperties = {
		initial?: z.infer<typeof PartialBlogPostSchema>;
	};

	let { initial }: FormProperties = $props();
	
	const form = useForm({
		schema: SubmitBlogPostSchema,
		initial: {
			title: '',
			desc: '',
			body: '',
			...initial
		},
		remote: submitBlogPost,
		onsuccess: ({ message, id }) => {
			toast.success(message);
			goto(resolve('/blog/[id]', { id }));
		}
	});

	const text = $derived(
		`# ${form.data.get('title')}\n\n---\n${form.data.get('desc')}\n\n---\n${form.data.get('body')}`
	);
	const converter = new Showdown.Converter();
</script>

<Tabs.Root value="form" class="relative flex h-full w-full max-w-340 items-center justify-center max-sm:items-start">
	<Tabs.List>
		<Tabs.Trigger value="form">Write</Tabs.Trigger>
		<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content
		value="form"
		class={cn(
			'flex h-full w-full max-w-340 flex-col overflow-hidden p-4',
			'rounded-lg border border-input shadow-xs',
			'bg-background'
		)}
	>
		<form use:form.submit class="h-full">
			<Input {form} name="title" label="Title" class="w-full max-w-340" />
			<Textarea
				{form}
				name="desc"
				label="Description"
				class="flex h-24 w-full max-w-340 resize-none"
			/>
			<Textarea {form} name="body" class="flex h-full w-full max-w-340 resize-none" />
			<Submit {form} label="Submit Post" size='sm' class="absolute top-0 right-0" />
			<Button size="sm" class="absolute top-0 right-28 w-18" onclick={() => history.back()}>Back</Button>
		</form>
	</Tabs.Content>
	<Tabs.Content
		value="preview"
		class="flex h-full w-full flex-col items-center justify-center overflow-hidden"
	>
		<div
			class={cn(
				'prose prose-neutral dark:prose-invert',
				'h-full w-full max-w-340 flex-col overflow-x-hidden overflow-y-auto p-4',
				'rounded-lg border border-input shadow-xs',
				'bg-background **:my-4'
			)}
		>
			{@html converter.makeHtml(text)}
		</div>
	</Tabs.Content>
</Tabs.Root>
