<!-- <script lang="ts">
	import * as Tabs from '@/components/ui/tabs';
	import { cn } from '@/utils';
	import { mode } from 'mode-watcher';
	import Auth from './$components/auth.svelte';
	import Legal from './$components/legal.svelte';
</script>

<div
	class={cn(
		'absolute top-0 left-0 h-full w-full -z-50',
		mode.current === 'dark' ? 'bg-[url(/auth-bg-black.svg)]' : 'bg-[url(/auth-bg-gray.svg)]',
		'bg-alpha bg-cover'
	)}
></div>

<Tabs.Root value="auth" class="flex h-full w-full items-center justify-start">
	<Tabs.List>
		<Tabs.Trigger value="auth">Auth</Tabs.Trigger>
		<Tabs.Trigger value="legal">Legal Documentation</Tabs.Trigger>
	</Tabs.List>
	<Auth />
	<Legal />
</Tabs.Root> -->
