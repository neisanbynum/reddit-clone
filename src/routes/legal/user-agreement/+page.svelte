<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import * as Field from '@/components/ui/field';
	import { getLegalNotice, getLegalNoticeDates } from '@/remote/legal/privacy-policy.remote';
	import { cn } from '@/utils';
	import { DateFormatter } from '@internationalized/date';
	import Showdown from 'showdown';
	import type { ChangeEventHandler } from 'svelte/elements';

	const dates = $derived(await getLegalNoticeDates({ type: 'user-agreement' }));
	let effective = $derived(dates.at(0));
	const onchange: ChangeEventHandler<HTMLSelectElement> = (e) => {
		try {
			effective = new Date(e.currentTarget.value);
		} catch {
			effective = undefined;
		}
	};

	const formatter = new DateFormatter('en-US', { dateStyle: 'long' });

	const policy = $derived(await getLegalNotice({ type: 'user-agreement', effective }));
	let markdown = $derived(
		`#### Effective Date: ${formatter.format(policy.effective)}\n#### Revision Date: ${formatter.format(policy.revision)}\n\n---\n${policy.body}`
	);

	const converter = new Showdown.Converter();
</script>

<div class="flex h-full max-w-340 flex-col items-start justify-center gap-4 overflow-hidden">
	<Field.Field class="min-h-fit w-48 gap-1">
		<Field.Label for="effective-date-select" class="pl-1">Effective Date</Field.Label>
		<div
			class="group/native-select relative w-full has-[select:disabled]:opacity-50"
			data-slot="native-select-wrapper"
		>
			<select
				data-slot="native-select"
				class={cn(
					'h-9 w-full min-w-0 px-3 py-2 pr-9',
					'rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none',
					'bg-background selection:bg-primary ',
					'appearance-none text-sm selection:text-primary-foreground placeholder:text-muted-foreground',
					'disabled:pointer-events-none disabled:cursor-not-allowed',
					'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
					'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'
				)}
				id="effective-date-select"
				{onchange}
			>
				{#each dates.map((date) => [formatter.format(date), date]) as option (option[0])}
					<option data-slot="native-select-option" value={option[1]}>
						{option[0]}
					</option>
				{/each}
			</select>
			<ChevronDownIcon
				class="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground opacity-50 select-none"
				aria-hidden="true"
				data-slot="native-select-icon"
			/>
		</div>
	</Field.Field>
	<div
		class="prose flex h-full w-full max-w-340 flex-col self-center overflow-x-hidden overflow-y-auto rounded-lg border border-input bg-background p-4 shadow-xs prose-neutral dark:prose-invert"
	>
		{@html converter.makeHtml(markdown)}
	</div>
</div>
