<script lang="ts" module>
	import type { Prettier } from '@/utilities/types';
	import type { Action } from 'svelte/action';
	import type { SVGAttributes } from 'svelte/elements';

	export type LogoProperties = Prettier<
		Omit<SVGAttributes<SVGSVGElement>, 'children' | 'xmlns' | 'width'> & {
			icononly?: boolean;
		}
	>;
</script>

<script lang="ts">
	let { height, icononly = false, ...rest }: LogoProperties = $props();

	let width = $state<number>();
	let circle = $state<Partial<Record<'cx' | 'cy' | 'r', number>>>({});
	let path = $state<string>('');
	let text = $state<Record<'x' | 'y' | 'font-size', number>>();

	const adjust: Action<SVGElement> = (node) => {
		$effect(() => {
			const adjuster = () => {
				const rect = node.getBoundingClientRect()
				const height = rect.height;

				circle = { cx: height / 2, cy: height / 2, r: height / 2 };
				path = `M ${height / 2} ${height}, 0 ${height}, ${height / 2} ${height / 2}`;

				width = height
			};

			adjuster();

			const observer = new ResizeObserver(adjuster);
			observer.observe(node);

			return () => observer.disconnect();
		});
	};

	const capture: Action<SVGTextElement> = (node) => {
		$effect(() => {
			const capturer = () => {
				const d = (circle.r ?? 0) * 2;
				const rect = node.getBoundingClientRect();
				const height = rect.height;

				text = { x: d + 2, y: d / 2 + height / 4, 'font-size': d / 2 };
				width = d + 2 + rect.width;
			};

			capturer();

			const observer = new ResizeObserver(capturer);
			observer.observe(node);

			return () => observer.disconnect();
		});
	};
</script>

<svg use:adjust xmlns="http://www.w3.org/2000/svg" height={height ?? 300} {width} {...rest}>
	<circle {...circle} class="fill-orange-600" />
	<path class="fill-orange-600" d={path} />
	{#if !icononly}
		<text use:capture {...text} fill="currentColor" font-weight="bolder" text-anchor="start">
			neisan-reddit
		</text>
	{/if}
</svg>
