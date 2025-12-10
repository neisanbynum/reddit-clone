<script lang="ts">
	import BlogPostForm from '@components/blog/blog-form.svelte';
	import type { PageProps } from './$types';

    const { data }: PageProps = $props()
</script>

<BlogPostForm initial={data} />
