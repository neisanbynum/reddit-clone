<!-- <script lang="ts">
	import { titleCase } from 'title-case';
	import { useForm } from '@/utilities/useForm.svelte';
	import TabContent from './tab-content.svelte';
	import {
        getSiteManager,
		getSiteManagers,
		removeSiteManager,
		setSiteManager
	} from '$remote/auth.remote';
	import {
		SiteManagerFormSchema,
		AuthoritySchema,
		RemoveSiteManagerFormSchema
	} from '$remote/auth.schema';
	import { toast } from 'svelte-sonner';
	import Input from '@/components/custom/input.svelte';
	import Select from '@/components/custom/select.svelte';
	import Submit from '@/components/custom/submit.svelte';
	import * as Field from '@/components/ui/field';
	import { Separator } from '@/components/ui/separator';

	const create = useForm({
		schema: SiteManagerFormSchema,
		initial: {
			username: ''
		},
		remote: setSiteManager,
		onsuccess: async ({ message }) => {
			toast.success(message);
			await getSiteManagers().refresh();
		}
	});

	let admins = $derived.by(async () => {
		const usernames = await getSiteManagers();
		return Object.fromEntries(usernames.map((name) => [name, name]));
	});

	const update = useForm({
		schema: SiteManagerFormSchema,
		initial: {
			username: ''
		},
		remote: setSiteManager,
		onsuccess: async ({ message }) => {
			toast.success(message);
			await getSiteManagers().refresh();
		}
	});

	update.onchange('username', async (value: string) => {
		const admin = await getSiteManager(value);
		if (admin) {
            admin.permissions.entries().forEach(([perm, auth]) => update.data.set(perm, auth))
		}
	});

	const revoke = useForm({
		schema: RemoveSiteManagerFormSchema,
		initial: {
			username: ''
		},
		remote: removeSiteManager,
		onsuccess: async ({ message }) => {
			toast.success(message);
			await getSiteManagers().refresh();
		}
	});

	const authority = Object.fromEntries(
		Array.from(AuthoritySchema.values).map((val) => [titleCase(val), val])
	);
</script>

<TabContent value="auth">
	<form use:create.submit class="w-full items-start justify-center">
		<h3 class="font-bold">Add Site Manager</h3>
		<Field.Group class="flex w-full items-start justify-center gap-1 p-1">
			<Input form={create} name="username" label="Username" class="max-w-84 min-w-68" />
			<Field.Group class="flex min-w-68 flex-row gap-4">
				<Select
					form={create}
					name="legal"
					label="Legal Documents"
					options={authority}
					class="max-w-40 min-w-32"
				/>
				<Select
					form={create}
					name="posts"
					label="Post Modification"
					options={authority}
					class="max-w-40 min-w-32"
				/>
			</Field.Group>
		</Field.Group>
		<Submit form={create} label="Create Super Admin" class="w-48" />
	</form>
	<Separator />
	<form use:update.submit class="w-full items-start justify-center">
		<h3 class="font-bold">Update Site Manager Permissions</h3>
		<Field.Group class="flex w-full items-start justify-center gap-1 p-1">
			<Select
				form={update}
				name="username"
				label="Site Manager"
				options={await admins}
				class="max-w-84 min-w-68"
			/>
			<Field.Group class="flex min-w-68 flex-row gap-4">
				<Select
					form={update}
					name="legal"
					label="Legal Documents"
					options={authority}
					class="max-w-40 min-w-32"
				/>
				<Select
					form={update}
					name="posts"
					label="Post Modification"
					options={authority}
					class="max-w-40 min-w-32"
				/>
			</Field.Group>
		</Field.Group>
		<Submit form={create} label="Update Super Admin" class="w-48" />
	</form>
	<Separator />
	<form use:revoke.submit class="w-full items-start justify-center">
		<h3 class="font-bold">Remove Site Manager</h3>
		<Select
			form={revoke}
			name="username"
			label="Site Manager"
			options={await admins}
			class="max-w-84 min-w-68"
		/>
		<Submit form={create} label="Remove Site Manager" class="w-48" />
	</form>
</TabContent> -->
