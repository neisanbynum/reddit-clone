<script lang="ts">
	import { setAppContext } from '$lib/context/app.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '@/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Topbar from '@components/shared/topbar.svelte';
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '@components/shared/sidebar.svelte';

	let { children, data }: LayoutProps = $props();


	const app = setAppContext();
	app.hydrate(data)
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-right" richColors />
<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />
	<div class="bg-red relative grid h-dvh w-screen grid-cols-1 grid-rows-[3rem_auto]">
		<Topbar />
		<div
			class="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden p-4"
		>
			{@render children()}
		</div>
	</div>
</Sidebar.Provider>
