import type { FormManager } from "@/utilities/useForm.svelte";
import type { Action } from "svelte/action";
import type z from "zod/v4";

export class ImageCropper<Schema extends z.ZodObject, T> {
	form: FormManager<Schema, T>;
	name: keyof z.infer<Schema>;

	open = $state<boolean>(false);
	captured = $state<boolean>(false);

	w = $state<number>(0);
	h = $state<number>(0);
	r = $state<number>(0);
	d = $derived<number>(this.r * 2);
	x = $state<number>(0);
	y = $state<number>(0);

	url = $state<string>();
	img = $state<HTMLImageElement | null>(null);
	mask = $state<SVGPathElement | null>(null);

	constructor(form: FormManager<Schema, T>, name: keyof z.infer<Schema>) {
		this.form = form;
		this.name = name;
		$effect(() => {
			if (!this.open && !this.captured) {
				this.reset();
			}
		});
	}

    get path(): string {
        if (!this.img) return ''
        return `M 0 0, 0 300, 300 300, 300 0, 0 0, M 0 150 A 150`
    }

	onchange: Action<HTMLInputElement> = (node) => {
		$effect(() => {
			const change = () => {
				const file = node.files?.item(0);
				if (!file) return;

				this.url = URL.createObjectURL(file);
				this.open = true;
			};

			const controller = new AbortController();
			const signal = controller.signal;

			node.addEventListener("change", change, { signal });
			node.addEventListener("mousedown", this.reset, { signal });
		});
	};

	reset() {
		this.form.data.delete(this.name);
		this.open = false;
		this.captured = false;
		this.w = 0;
		this.h = 0;
		this.r = 0;
		this.x = 0;
		this.y = 0;
	}
}
