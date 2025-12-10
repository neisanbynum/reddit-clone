<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Background from '@components/shared/background.svelte';
	import Input from '@/components/custom/input.svelte';
	import Submit from '@/components/custom/submit.svelte';
	import Textarea from '@/components/custom/textarea.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Field from '@/components/ui/field';
	import { createFeedGroup } from '@/remote/feed.remote';
	import { CreateFeedGroupSchemaForm } from '@/remote/feed.schema';
	import { useForm } from '@/utilities/useForm.svelte';
	import { toast } from 'svelte-sonner';
	import * as Tabs from '@/components/ui/tabs';
	import { Separator } from '@/components/ui/separator';
	import ImageInput from '@/components/custom/image-input.svelte';
	import * as Avatar from '@/components/ui/avatar'

	const form = useForm({
		schema: CreateFeedGroupSchemaForm,
		initial: {
			name: ''
		},
		remote: createFeedGroup,
		onsuccess: ({ message, id }) => {
			toast.success(message);
			goto(resolve('/subneisan/[id]', { id }));
		}
	});
</script>

<Background />

<Tabs.Root value="form" class="@container flex h-full w-full items-center justify-center">
	<Tabs.List>
		<Tabs.Trigger value="form">Form</Tabs.Trigger>
		<Tabs.Trigger value="feed">Feed</Tabs.Trigger>
		<Tabs.Trigger value="about" class="@2xl:hidden">About</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="form" class="flex w-full items-center justify-center">
		<Card.Root class="z-10 flex h-fit w-lg">
			<Card.Header>
				<Card.Title>Create SubNeisan-Reddit Group</Card.Title>
				<Card.Description>
					<span class="flex min-w-full flex-wrap">
						By continuing, you agree to our
						<Button
							variant="link"
							class="m-0 flex h-fit w-fit p-0 px-1 text-sm"
							onclick={() => goto(resolve('/legal/user-agreement'))}
						>
							User Agreement
						</Button>
						and acknowledge that you understand the
						<Button
							variant="link"
							class="m-0 flex h-fit w-fit p-0 pl-1 text-sm"
							onclick={() => goto(resolve('/legal/privacy-policy'))}
						>
							Privacy Policy
						</Button>.
					</span>
				</Card.Description>
			</Card.Header>
			<Card.Content class="max-sm:h-full">
				<form use:form.submit class="max-sm:h-full">
					<Field.Group class="gap-2">
						<ImageInput {form} name="avatar" label="Group Avatar" />
						<Input {form} name="name" label="Group Name" />
						<Textarea {form} name="desc" label="Group Description" class="h-36 resize-none" />
						<Textarea
							{form}
							name="rules"
							label="Group Rules"
							desc="Plain-Text or Markup"
							class="h-80 resize-none"
						/>
					</Field.Group>
					<Submit {form} label="Create Group" />
				</form>
			</Card.Content>
			<!-- <Card.Footer class="flex items-center justify-start gap-1">
		<p class="text-sm">{footer}</p>
		<Button variant="link" class="m-0 flex h-fit w-fit p-0 text-sm" onclick={toggle}>
			{redirect}
			</Button>
			</Card.Footer> -->
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content
		value="feed"
		class="flex w-full flex-col items-center justify-start gap-4 rounded-lg border-2 border-card bg-background p-4 shadow-md"
	>
		<div class="flex w-full flex-col items-start">
			<div class="flex w-full h-fit gap-1 justify-center items-center">
				<Avatar.Root>
					<Avatar.Image class="size-12" src={form.data.get('avatar')} alt="Avatar" />
					<Avatar.Fallback>AV</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex w-full flex-col items-start">
					<h3 class="text-xl font-semibold text-orange-600">
						{`nr/${form.data.get('name') !== '' ? form.data.get('name') : 'SubNeisan-Reddit Group Name'}`}
					</h3>
					<h5 class="text-sm font-semibold">Members: <span class="font-normal">0</span></h5>
				</div>
			</div>
			<div class="h-full w-full grid-cols-7 overflow-hidden">
				<div class="col-span-2 h-full w-full border-l-2">
					<div></div>
				</div>
			</div>
		</div>
		<Separator />
	</Tabs.Content>
</Tabs.Root>
