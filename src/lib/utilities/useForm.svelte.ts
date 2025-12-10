/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyInstance } from '@/utilities/assertion';
import type { HttpError, RemoteCommand } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';
import type { Action } from 'svelte/action';
import { SvelteMap } from 'svelte/reactivity';
import z from 'zod/v4';

type ValidationEvent = 'onblur' | 'onsubmit';

export type useFormConfig<Schema extends z.ZodObject, T> = {
	schema: Schema;
	initial: z.core.input<Schema>;
	validate?: ValidationEvent;
	remote: RemoteCommand<z.infer<Schema>, T>;
	onsuccess: (res: Awaited<T>) => void | Promise<void>;
	onerror?: (error: HttpError) => void | Promise<void>;
};

const MultiInputFieldRegex = new RegExp(/^(?:([a-zA-Z0-9]+)\[([0-9]{1,})\])$/);

type FormElement = HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export class FormManager<Schema extends z.ZodObject, T> {
	private readonly schema: Schema;
	private readonly validate: ValidationEvent;
	readonly data = new SvelteMap<keyof z.infer<Schema>, any>();
	readonly errors = new SvelteMap<keyof z.infer<Schema>, string>();
	private readonly remote: RemoteCommand<z.infer<Schema>, T>;
	loading = $state<boolean>(false);
	private readonly onsuccess: (res: Awaited<T>) => void | Promise<void>;
	private readonly onerror?: (error: HttpError) => void | Promise<void>;
	private readonly onchanges = new SvelteMap<keyof z.infer<Schema>, (value: any) => void | Promise<void>>()

	constructor(config: useFormConfig<Schema, T>) {
		this.schema = config.schema;
		this.validate = config.validate ?? 'onblur';
		this.remote = config.remote;
		this.onsuccess = config.onsuccess;
		this.onerror = config.onerror;
		Object.entries(config.initial).forEach(([k, v]) => {
			this.data.set(k, v);
		});
	}

	onchange = (name: keyof z.infer<Schema>, callback: (value: any) => void | Promise<void>) => {
		this.onchanges.set(name, callback)
	}

	validation = (name?: keyof z.infer<Schema>) => {
		const parse = this.schema.safeParse(Object.fromEntries(this.data));
		if (!parse.success) {
			for (const issue of parse.error.issues) {
				if (issue.code === 'unrecognized_keys') continue;

				const path = issue.path.at(0);
				if (!path) continue;
				if (name && (path !== name || !this.data.get(name))) continue;

				this.errors.set(name ?? String(path), issue.message);
			}
			return;
		}
		return parse.data;
	};

	manager: Action<FormElement> = (node) => {
		$effect(() => {
			const onblur = () => {
				if (this.validate === 'onblur') this.validation(node.name);
			};

			const onchange = async () => {
				if (AnyInstance(node, HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement)) {
					if (AnyInstance(node, HTMLInputElement) && node.type === 'checkbox') {
						this.data.set(node.name, node.checked);
					} else {
						this.data.set(node.name, node.value)
					}

					if (this.onchanges.has(node.name)) {
						await this.onchanges.get(node.name)!(this.data.get(node.name))
					}
				}
			};

			const onfocus = () => {
				this.errors.delete(node.name);
			};

			if (AnyInstance(node, HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement)) {
				if (AnyInstance(node, HTMLInputElement) && node.type === 'checkbox') {
					node.checked = this.data.get(node.name) ?? false;
				} else {
					node.value = this.data.get(node.name) ?? '';
				}
			}

			const controller = new AbortController();
			const signal = controller.signal;

			node.addEventListener('focusout', onblur, { signal });
			node.addEventListener('input', onchange, { signal });
			node.addEventListener('focusin', onfocus, { signal });

			return () => controller.abort();
		});
	};

	submit: Action<HTMLFormElement> = (form) => {
		$effect(() => {
			const onsubmit = async (e: SubmitEvent) => {
				e.preventDefault();

				try {
					this.loading = false;
					for (const [key, value] of this.data.entries()) {
						if (value instanceof Map) {
							this.data.set(key, value.values());
						}
					}
					const parsed = this.validation();
					if (!parsed) return;

					const res = await this.remote(parsed);
					form.reset();
					this.data.clear();
					await this.onsuccess(res);
				} catch (error: any) {
					if (this.onerror) {
						await this.onerror(error);
						return;
					}
					console.error(error);
					toast.error(error.body.message);
				} finally {
					this.loading = false;
				}
			};

			form.addEventListener('submit', onsubmit);

			return () => form.removeEventListener('submit', onsubmit);
		});
	};
}

export const useForm = <Schema extends z.ZodObject, T>(config: useFormConfig<Schema, T>) => {
	return new FormManager(config);
};
