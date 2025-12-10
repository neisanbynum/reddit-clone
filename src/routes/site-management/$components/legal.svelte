<!-- <script lang="ts">
	import TabContent from './tab-content.svelte';
	import Input from '@/components/custom/input.svelte';
	import Select from '@/components/custom/select.svelte';
	import Submit from '@/components/custom/submit.svelte';
	import Textarea from '@/components/custom/textarea.svelte';
	import {
		getLegalNotice,
		getLegalNoticeDates,
		setLegalNotice
	} from '@/remote/legal/privacy-policy.remote';
	import { LegalNoticeSchema, LegalNoticeTypeSchema } from '$remote/legal.schema';
	import { useForm } from '@/utilities/useForm.svelte';
	import { DateFormatter } from '@internationalized/date';
	import Showdown from 'showdown';
	import { toast } from 'svelte-sonner';
	import type { Action } from 'svelte/action';
	import { titleCase } from 'title-case';

	let dates = $state<Array<Date>>([]);
	const formatter = new DateFormatter('en-US', { dateStyle: 'short' });

	const form = useForm({
		schema: LegalNoticeSchema,
		initial: {
			type: '',
			body: ''
		},
		remote: setLegalNotice,
		onsuccess: ({ message }) => {
			toast.success(message);
            dates = []
		}
	});

	const types = Object.fromEntries(
		Array.from(LegalNoticeTypeSchema.values).map((val) => [titleCase(val).replace('-', ' '), val])
	);
	const effectives = $derived(Object.fromEntries(dates.map((val) => [formatter.format(val), val])));

	form.onchange('type', async (type) => {
        form.data.delete('effective')
		dates = await getLegalNoticeDates({ type });
	});
	form.onchange('effective', async (effective) => {
		if (dates.length === 0) return;
		form.data.set('body', (await getLegalNotice({ type: form.data.get('type'), effective })).body);
	});

	const converter = new Showdown.Converter();
	converter.setFlavor('github');

	let textarea = $state<HTMLTextAreaElement | null>(null);

	const scroller: Action<HTMLDivElement> = (node) => {
		$effect(() => {
			if (!textarea) return;

			const scroll = () => {
				if (!textarea) return;
				const percent = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
				node.scrollTop = (node.scrollHeight - node.clientHeight) * percent;
			};

			scroll();

			textarea.addEventListener('scroll', scroll);

			return () => {
				if (!textarea) return;
				textarea.removeEventListener('scroll', scroll);
			};
		});
	};
</script>

<TabContent value="legal" class="relative max-h-full overflow-hidden">
	<form use:form.submit class="sticky top-0 h-1/2 w-full gap-2">
		<div class="flex w-full items-end justify-start gap-2">
			<div class="flex w-full items-start justify-start gap-2 max-sm:flex-col max-sm:gap-1">
				<Select
					{form}
					name="type"
					label="Legal Notice Type"
					options={types}
					class="w-full max-w-48"
				/>
				{#if dates.length === 0}
					<Input
						{form}
						required={false}
						name="effective"
						label="Effective Date"
						class="w-full max-w-48"
					/>
				{:else}
					<Select
						{form}
						name="effective"
						label="Effective Date"
						disabled={dates.length === 0}
						options={effectives}
						class="w-full max-w-48"
					/>
				{/if}
			</div>
			<Submit {form} label="Submit Legal Notice" size="sm" class="mb-1.25" />
		</div>
		<Textarea bind:ref={textarea} {form} name="body" class="flex h-full w-full resize-none" />
	</form>
	<div
		use:scroller
		class="prose flex max-h-1/2 min-w-full flex-col overflow-hidden prose-neutral dark:prose-invert"
	>
		{@html `<h4>Effective Date: ${formatter.format(new Date(form.data.get('effective') ?? Date.now()))}</h4> <h4>Revision Date: ${formatter.format(new Date())}</h4> ${converter.makeHtml('---\n'.concat(form.data.get('body') ?? ''))}`}
	</div>
</TabContent> -->
