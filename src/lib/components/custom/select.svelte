<script lang="ts" module>
	export type InputProperties<Schema extends z.ZodObject, T> = Prettier<
		Omit<HTMLSelectAttributes, 'children' | 'value' | 'files' | 'type' | 'form'> & {
			ref?: HTMLSelectElement | null | undefined;
			form: FormManager<Schema, T>;
			name: keyof z.infer<Schema> | string;
			type?: 'single';
			label?: string;
			desc?: string;
			options: Record<string, any>;
		}
	>;
</script>

<script lang="ts" generics="Schema extends z.ZodObject, T">
	import type { Prettier } from '$lib/utilities/types';
	import type { FormManager } from '$lib/utilities/useForm.svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import * as Field from '@/components/ui/field';
	import z from 'zod/v4';
	import { classParser } from '$lib/utilities/class-parser';
	import { cn } from '$lib/utils';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let {
		ref = $bindable(null),
		form,
		name,
		id,
		label,
		desc,
		options,
		class: rawclass,
		...rest
	}: InputProperties<Schema, T> = $props();

	const classes = classParser(rawclass ?? '');
</script>

<Field.Field class={cn('min-h-fit gap-1', classes.dimensions, classes.spacing)}>
	<Field.Label for={id ?? name} class="pl-1">{label}</Field.Label>
	<div
		class="group/native-select relative w-full has-[select:disabled]:opacity-50"
		data-slot="native-select-wrapper"
	>
		<select
			{...rest}
			bind:this={ref}
			data-slot="native-select"
			use:form.manager
			class={cn(
				'h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30 dark:hover:bg-input/50',
				'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
				classes.parsed
			)}
			id={id ?? name}
			{name}
		>
			{#each Object.entries(options) as option (option[0])}
				<option data-slot="native-select-option" value={option[1]}>
					{option[0]}
				</option>
			{/each}
		</select>
        <ChevronDownIcon
          class="text-muted-foreground pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
          aria-hidden="true"
          data-slot="native-select-icon"
        />
	</div>
	<Field.Description class="pl-1">{desc}</Field.Description>
	<Field.Error class="pl-1 text-rose-500">{form.errors.get(name)}</Field.Error>
</Field.Field>
