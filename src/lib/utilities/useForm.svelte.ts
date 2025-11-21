/* eslint-disable @typescript-eslint/no-explicit-any */
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

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLButtonElement;

export class FormManager<Schema extends z.ZodObject, T> {
	private readonly schema: Schema;
	private readonly validate: ValidationEvent;
	private readonly data = new SvelteMap<keyof z.infer<Schema>, any>();
	readonly errors = new SvelteMap<keyof z.infer<Schema>, string>();
	private readonly remote: RemoteCommand<z.infer<Schema>, T>;
	loading = $state<boolean>(false);
	private readonly onsuccess: (res: Awaited<T>) => void | Promise<void>;
	private readonly onerror?: (error: HttpError) => void | Promise<void>;

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

			const onchange = () => {
				if (node instanceof HTMLInputElement) {
					if (MultiInputFieldRegex.test(node.name)) {
						const segments = MultiInputFieldRegex.exec(node.name);
						if (segments === null) return;
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const [_, name, index] = segments;
						if (!this.data.has(name) || !(this.data.get(name) instanceof Map)) {
							this.data.set(name, new SvelteMap([[index, name]]));
						} else {
							const map: SvelteMap<string, any> = this.data.get(name);
							map.set(index, node.value);
						}
					} else if (node.type === 'checkbox') {
						this.data.set(node.name, node.checked);
					} else {
						this.data.set(node.name, node.value);
					}
				}
			};

			const onfocus = () => {
				this.errors.delete(node.name);
			};

			if (node instanceof HTMLInputElement) {
				if (MultiInputFieldRegex.test(node.name)) {
					const segments = MultiInputFieldRegex.exec(node.name);
					if (segments === null) {
						throw new Error('Invalid MultiField Name');
					}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const [_, name, index] = segments;

					if (!this.data.has(name) || !(this.data.get(name) instanceof Map)) {
						const init = this.data.get(name);
						const map = new SvelteMap();
						if (Array.isArray(init)) {
							init.forEach((v, i) => {
								map.set(i, v);
							});
						}
						this.data.set(name, map);
					}

					node.value = this.data.get(name).get(index);
				}

				if (node.type === 'checkbox') {
					node.checked = this.data.get(node.name) ?? false;
				} else if (this.data.has(node.name)) {
					node.value = this.data.get(node.name);
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
