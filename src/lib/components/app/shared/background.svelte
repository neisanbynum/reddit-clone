<script lang="ts">
	import { cn } from '@/utils';
	import { mode } from 'mode-watcher';
</script>

<div
	class={cn(
		'absolute top-0 left-0 h-full w-full',
		mode.current === 'dark' ? 'bg-[url(/auth-bg-black.svg)]' : 'bg-[url(/auth-bg-gray.svg)]',
		'bg-alpha -z-10 bg-cover'
	)}
></div>
