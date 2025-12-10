<script lang="ts">
	import { register } from '$remote/auth.remote';
	import { RegisterFormSchema } from '$remote/auth.schema';
	import { useForm } from '@/utilities/useForm.svelte';
	import * as Field from '@/components/ui/field';
	import { Button } from '@/components/ui/button';
	import Input from '@/components/custom/input.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const form = useForm({
		schema: RegisterFormSchema,
		initial: {
			last: '',
			first: '',
			prefermiddle: false,
			email: '',
			username: '',
			password: '',
			confirmpassword: ''
		},
		remote: register,
		onsuccess: ({ message }) => {
			toast.success(message);
			goto(resolve('/login'));
		}
	});
</script>

<form use:form.submit class="max-sm:h-full">
	<Field.Group class="gap-2">
		<Field.Set class="flex flex-col gap-2">
			<Field.Set class="flex flex-col sm:flex-row gap-2">
				<Input
					{form}
					class="w-full sm:w-1/3"
					name="last"
					label="Last Name"
					autocomplete="family-name"
				/>
				<Input
					{form}
					class="w-full sm:w-2/3"
					name="first"
					label="First Name"
					autocomplete="given-name"
				/>
			</Field.Set>
			<Field.Set class="flex flex-col sm:flex-row gap-2 relative">
				<Input {form} name="middle" label="Middle Name" autocomplete="additional-name" />
				<Field.Field
					class="flex flex-row justify-center items-center gap-1 relative sm:top-1/2 w-fit h-fit"
				>
					<input
						use:form.manager
						type="checkbox"
						class="flex min-w-4 min-h-4 border-2"
						name="prefermiddle"
					/>
					<Field.Label class="text-nowrap m-0">Prefer Middle?</Field.Label>
				</Field.Field>
			</Field.Set>
		</Field.Set>
		<Field.Separator />
		<Field.Set class="flex flex-col gap-2">
            <Field.Set class="flex flex-col sm:flex-row gap-2 relative">
                <Input {form} name="username" label="Username" autocomplete="username" class="sm:w-2/5" />
                <Input {form} name="email" label="Email Address" type="email" autocomplete="email" class="sm:w-3/5" />
            </Field.Set>
			<Field.Set class="flex flex-col sm:flex-row gap-2 relative">
				<Input
					{form}
					name="password"
					label="Password"
					type="password"
					autocomplete="new-password"
				/>
				<Input
					{form}
					name="confirmpassword"
					label="Confirm Password"
					type="password"
					autocomplete="new-password"
				/>
			</Field.Set>
		</Field.Set>
	</Field.Group>
	<Button type="submit" class="w-3/4">Register</Button>
</form>
