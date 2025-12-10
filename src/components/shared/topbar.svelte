<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cn } from '@/utils';
	import Logo from './logo.svelte';
	import ThemeToggle from './theme-toggle.svelte';
	import { authenticate } from '$remote/auth.remote';
	import * as Dropdown from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';
	import MenuOpenIcon from '@lucide/svelte/icons/menu';
	import MenuIcon from '@lucide/svelte/icons/square-menu';

	const authenticated = $state(await authenticate());
	let openmenu = $state<boolean>(false);
</script>

<div
	class={cn(
		'sticky top-0 z-50',
		'flex h-12 w-full items-center justify-between p-2',
		'border-b border-card'
	)}
>
	<Logo class="h-8 cursor-pointer" onclick={() => goto(resolve(authenticated ? '/feed' : '/'))} />
	<div class={cn('flex h-full w-fit items-center justify-center gap-1')}>
		{#if authenticated}
			{@render Menu()}
		{/if}
		<ThemeToggle />
	</div>
</div>

{#snippet Menu()}
	<Dropdown.Root bind:open={openmenu}>
		<Dropdown.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" class="relative">
					<MenuIcon
						class={cn(
							openmenu ? 'scale-0 rotate-90' : 'scale-100 rotate-0',
							'transition-all! duration-300'
						)}
					/>
					<MenuOpenIcon
						class={cn(
							!openmenu ? 'scale-0 -rotate-90' : 'scale-100 rotate-0',
							'absolute transition-all! duration-300'
						)}
					/>
				</Button>
			{/snippet}
		</Dropdown.Trigger>
		<Dropdown.Content>
            <Dropdown.Group>
                <Dropdown.Item onclick={() => goto(resolve('/feed'))}>Feed</Dropdown.Item>
                <Dropdown.Item onclick={() => goto(resolve('/blog'))}>Blog</Dropdown.Item>
            </Dropdown.Group>
        </Dropdown.Content>
	</Dropdown.Root>
{/snippet}
