<script lang="ts">
	import { login } from '$remote/auth.remote';
	import { LoginFormSchema } from '$remote/auth.schema';
	import { useForm } from '@/utilities/useForm.svelte';
	import { toast } from 'svelte-sonner';
	import * as Field from '@/components/ui/field';
	import Input from '@/components/custom/input.svelte';
	import Submit from '@/components/custom/submit.svelte';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const form = useForm({
		schema: LoginFormSchema,
		initial: {
			identifier: '',
			password: ''
		},
		remote: login,
		onsuccess: ({ message }) => {
			toast.success(message);
			goto(resolve('/feed'));
		}
	});
</script>

<form use:form.submit class="max-sm:h-full">
	<Field.Group class="gap-2">
		<Input {form} name="identifier" label="Username or Email Address" />
		<Input
			{form}
			name="password"
			label="Password"
			type="password"
			autocomplete="current-password"
		/>
		<Button
			variant="link"
			class="m-0 h-fit w-fit p-0 pl-1 text-sm"
			onclick={() => console.log("You've Forgot Your Password!")}
		>
			Forgot Password?
		</Button>
	</Field.Group>
	<Submit {form} label="Sign In" class="w-3/4" />
</form>
