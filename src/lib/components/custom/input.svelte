<script lang="ts" module>
	export type InputProperties<Schema extends z.ZodObject, T> = Prettier<
		Omit<HTMLInputAttributes, 'children' | 'value' | 'files' | 'type' | 'form'> & {
			ref?: HTMLInputElement | null | undefined;
			form: FormManager<Schema, T>;
			name: keyof z.infer<Schema> | string;
			type?: Exclude<HTMLInputTypeAttribute, 'file' | 'button' | 'checkbox'>;
			label?: string;
			desc?: string;
		}
	>;
</script>

<script lang="ts" generics="Schema extends z.ZodObject, T">
	import type { Prettier } from '$lib/utilities/types';
	import type { FormManager } from '$lib/utilities/useForm.svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import * as Field from '../ui/field';
	import z from 'zod/v4';
	import { classParser } from '$lib/utilities/class-parser';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		form,
		name,
		id,
		label,
		required = true,
		desc,
		class: rawclass,
		...rest
	}: InputProperties<Schema, T> = $props();

	const classes = classParser(rawclass ?? '');
</script>

<Field.Field class={cn('min-h-fit gap-1', classes.dimensions, classes.spacing)}>
	<Field.Label for={id ?? name} class="pl-1">{label}</Field.Label>
	<input
		{...rest}
		bind:this={ref}
		data-slot="input"
		use:form.manager
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
	<Field.Error class="pl-1" errors={[{ message: form.errors.get(name) }]} hidden={!form.errors.has(name)} />
</Field.Field>
