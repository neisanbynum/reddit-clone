<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Login from '@components/login/login.svelte';
	import Register from '@components/login/register.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '@/utils';
	import { mode } from 'mode-watcher';

	let variant = $state<'login' | 'register'>('login');
	const register = $derived(variant === 'register');

	const toggle = () => {
		variant = register ? 'login' : 'register';
	};

	const title = $derived(register ? 'Registration' : 'Authentication');
	const footer = $derived(register ? 'Already have an account?' : 'Need to create an account?');
	const redirect = $derived(register ? 'Sign In' : 'Register');
</script>

<div
	class={cn(
		'absolute top-0 left-0 h-full w-full',
		mode.current === 'dark' ? 'bg-[url(/auth-bg-black.svg)]' : 'bg-[url(/auth-bg-gray.svg)]',
		'bg-alpha bg-cover'
	)}
></div>

<Card.Root
	class={cn(
		'z-10 flex h-fit w-lg',
		'max-sm:absolute max-sm:h-full max-sm:w-full max-sm:rounded-none max-sm:border-0 max-sm:bg-background'
	)}
>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
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
		{#if register}
			<Register />
		{:else}
			<Login />
		{/if}
	</Card.Content>
	<Card.Footer class="flex items-center justify-start gap-1">
		<p class="text-sm">{footer}</p>
		<Button variant="link" class="m-0 flex h-fit w-fit p-0 text-sm" onclick={toggle}>
			{redirect}
		</Button>
	</Card.Footer>
</Card.Root>
