<script lang="ts">
	import Background from "@components/shared/background.svelte";
	import type { LayoutProps } from "./$types";

    let { children }: LayoutProps = $props();
</script>

<Background />
{@render children()}
