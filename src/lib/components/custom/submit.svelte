<script lang="ts" module>
	export const ButtonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
				destructive:
					'bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
				outline:
					'bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border',
				secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50'
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9',
				'icon-sm': 'size-8',
				'icon-lg': 'size-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof ButtonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof ButtonVariants>['size'];

	export type SubmitProperties<Schema extends z.ZodObject, T> = Prettier<
		Omit<HTMLButtonAttributes, 'children' | 'type' | 'form'> & {
			ref?: HTMLButtonElement | null | undefined;
			variant?: ButtonVariant;
			size?: ButtonSize;
			form: FormManager<Schema, T>;
			label?: string;
		}
	>;
</script>

<script lang="ts" generics="Schema extends z.ZodObject, T">
	import type { Prettier } from '$lib/utilities/types';
	import type { FormManager } from '$lib/utilities/useForm.svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import z from 'zod/v4';
	import { type VariantProps, tv } from 'tailwind-variants';
	import { cn } from '$lib/utils';
	import { Spinner } from '../ui/spinner';

	let {
		ref = $bindable(null),
		form,
		disabled = false,
		label = 'Submit',
		class: classname,
		variant = 'default',
		size = 'default',
		...rest
	}: SubmitProperties<Schema, T> = $props();
</script>

<button
	bind:this={ref}
	data-slot="button"
	{...rest}
	disabled={disabled || form.loading}
	aria-disabled={disabled || form.loading}
	type="submit"
    class={cn(ButtonVariants({ variant, size }), classname)}
>
	{#if form.loading}
		<Spinner />
	{:else}
		{label}
	{/if}
</button>
