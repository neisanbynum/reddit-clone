<script lang="ts" module>
	export type ImageInputProperties<Schema extends z.ZodObject, T> = Prettier<
		Omit<{ type?: 'file'; accept?: 'image/*' } & HTMLInputAttributes, 'value' | 'form'> & {
			ref?: HTMLInputElement | null | undefined;
			form: FormManager<Schema, T>;
			name: keyof z.infer<Schema> | string;
			label?: string;
			desc?: string;
		}
	>;
</script>

<script lang="ts" generics="Schema extends z.ZodObject, T">
	import { classParser } from '$lib/utilities/class-parser';
	import type { Prettier } from '$lib/utilities/types';
	import type { FormManager } from '$lib/utilities/useForm.svelte';
	import { cn } from '$lib/utils';
	import * as Dialog from '@/components/ui/dialog';
	import * as Field from '@/components/ui/field';
	import { clamp, ratio } from '@/utilities/math';
	import type { Action } from 'svelte/action';
	import type { HTMLInputAttributes, MouseEventHandler, WheelEventHandler } from 'svelte/elements';
	import z from 'zod/v4';
	import { Button } from '../ui/button';
	import { toast } from 'svelte-sonner';

	let {
		ref = $bindable(null),
		type = 'file',
		accept = 'image/*',
		form,
		name,
		id,
		label,
		required = true,
		desc,
		class: rawclass,
		...rest
	}: ImageInputProperties<Schema, T> = $props();

	const classes = classParser(rawclass ?? '');

	let url = $state<string>();
	let image = $state<HTMLImageElement | null>(null);
	let dimensions = $state<Record<'width' | 'height', number>>({ width: 0, height: 0 });
	let radius = $state<number>(0);
	let diameter = $derived<number>(radius * 2);
	let coords = $state<Record<'x' | 'y', number>>({ x: 0, y: 0 });
	let open = $state<boolean>(false);
	let captured = $state<boolean>(false);

	$effect(() => {
		if (!open && !captured) {
			form.data.delete(name);
		}
	});

	const capturer: Action<HTMLInputElement> = (node) => {
		$effect(() => {
			const onchange = () => {
				const file = node.files?.item(0);
				if (!file) return;

				url = URL.createObjectURL(file);
				open = true;
			};

			node.addEventListener('input', onchange);

			return () => node.removeEventListener('input', onchange);
		});
	};

	const resizer: Action<HTMLImageElement> = (node) => {
		$effect(() => {
			const resize = () => {
				dimensions = { width: node.clientWidth, height: node.clientHeight };
				coords = { x: node.clientWidth / 2, y: node.clientHeight / 2 };
				radius = Math.min(node.clientWidth, node.clientHeight) / 2;
			};

			const observer = new ResizeObserver(resize);
			observer.observe(node);

			return () => observer.disconnect();
		});
	};

	const cropper: Action<SVGCircleElement> = (node) => {
		$effect(() => {
			let clicked: boolean = false;

			const zoom = (e: WheelEvent) => {
				e.preventDefault();
				radius = clamp(
					100,
					radius + (e.deltaY > 0 ? -5 : 5),
					Math.min(dimensions.width, dimensions.height) / 2
				);
				clicked = true;
				move(e);
				clicked = false;
			};

			const mousedown = (e: MouseEvent) => {
				if (!e.currentTarget || !(e.currentTarget instanceof Node)) return;
				if (e.currentTarget.contains(node)) clicked = true;
			};

			const move = (e: MouseEvent) => {
				if (!clicked) return;
				coords = {
					x: clamp(radius, coords.x + e.movementX, dimensions.width - radius),
					y: clamp(radius, coords.y + e.movementY, dimensions.height - radius)
				};
			};

			const mouseup = (e: MouseEvent) => {
				if (!e.currentTarget || !(e.currentTarget instanceof Node)) return;
				if (e.currentTarget.contains(node)) clicked = false;
			};

			const controller = new AbortController();
			const signal = controller.signal;

			node.addEventListener('wheel', zoom, { signal });
			document.addEventListener('mousedown', mousedown, { signal });
			document.addEventListener('mousemove', move, { signal });
			document.addEventListener('mouseup', mouseup, { signal });

			return () => controller.abort();
		});
	};

	const capture = () => {
		if (!image) return;

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!context) {
			toast.error('Cannot Get 2D Context for Canvas');
			return;
		}

		const dimension = ratio(dimensions.height, diameter, image.naturalHeight);
		canvas.width = dimension;
		canvas.height = dimension;
		context.drawImage(
			image!,
			ratio(dimensions.width, coords.x - radius, image.naturalWidth),
			ratio(dimensions.height, coords.y - radius, image.naturalHeight),
			dimension,
			dimension,
			0,
			0,
			dimension,
			dimension
		);
		form.data.set(name, canvas.toDataURL());
		captured = true;
		open=false;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Crop Image</Dialog.Title>
			<Dialog.Description>Drag and scale to select captured desired portion.</Dialog.Description>
		</Dialog.Header>
		<div class="relative flex w-full min-w-fit items-center justify-center">
			<img bind:this={image} use:resizer src={url} alt={name} />
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={dimensions.width}
				height={dimensions.height}
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
			>
				<circle
					use:cropper
					cx={coords.x}
					cy={coords.y}
					r={radius}
					class="z-20 bg-transparent fill-transparent stroke-black stroke-5"
				/>
			</svg>
		</div>
		<Dialog.Footer>
			<Button onclick={capture}>Capture</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Field.Field class={cn('min-h-fit gap-1', classes.dimensions, classes.spacing)}>
	<Field.Label for={id ?? name} class="pl-1">{label}</Field.Label>
	<input
		{...rest}
		bind:this={ref}
		data-slot="input"
		use:form.manager
		use:capturer
		{type}
		{accept}
		{required}
		class={cn(
			'flex h-full min-h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
			'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
			'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
			classes.parsed
		)}
		id={id ?? name}
		{name}
	/>
	<Field.Description class="pl-1" hidden={!desc}>{desc}</Field.Description>
	<Field.Error
		class="pl-1"
		errors={[{ message: form.errors.get(name) }]}
		hidden={!form.errors.has(name)}
	/>
</Field.Field>
