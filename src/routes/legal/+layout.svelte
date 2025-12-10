<script lang="ts">
	import { cn } from '@/utils';
	import type { LayoutProps } from './$types';
	import { mode } from 'mode-watcher';
	import Background from '@components/shared/background.svelte';

	let { children }: LayoutProps = $props();
</script>

<Background />

{@render children()}
