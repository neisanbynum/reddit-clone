export function AnyInstance<U extends Array<{ new (): HTMLElement; prototype: HTMLElement }>>(
	item: unknown,
	...elements: U
): item is U[number]['prototype'] {
	for (const element of elements) {
		if (item instanceof element) return true;
	}
	return false;
}
