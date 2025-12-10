<script lang="ts">
	import { getAppContext } from '$context/app.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cn } from '@/utils';
	import Logo from './logo.svelte';
	import ThemeToggle from './theme-toggle.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';

	const app = getAppContext();
</script>

<div
	class={cn(
		'sticky top-0 z-50',
		'flex h-12 w-full items-center justify-between p-2',
		'border-b-3 border-card bg-background shadow-sm'
	)}
>
	<div class={cn('flex h-full w-fit items-center justify-center gap-2')}>
		<Sidebar.Trigger />
		<Logo
			class="h-8 cursor-pointer"
			onclick={() => goto(resolve(app.authenticated ? '/feed' : '/login'))}
		/>
	</div>
	<div class={cn('flex h-full w-fit items-center justify-center gap-1')}>
		<ThemeToggle />
	</div>
</div>
