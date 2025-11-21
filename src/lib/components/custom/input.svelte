<script lang="ts" module>
  export type InputProperties<Schema extends z.ZodObject, T> = Prettier<
    Omit<
      HTMLInputAttributes,
      "children" | "value" | "files" | "type" | "form"
    > & {
      ref?: HTMLInputElement | null | undefined
      form: FormManager<Schema, T>;
      name: keyof z.infer<Schema> | string;
      type?: Exclude<HTMLInputTypeAttribute, "file" | "button" | 'checkbox'>;
      label?: string;
      desc?: string;
    }
  >;
</script>

<script lang="ts" generics="Schema extends z.ZodObject, T">
  import type { Prettier } from "$lib/utilities/types";
  import type { FormManager } from "$lib/utilities/useForm.svelte";
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute,
  } from "svelte/elements";
  import * as Field from "../ui/field";
  import z from "zod/v4";
  import { classParser } from "$lib/utilities/class-parser";
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    form,
    name,
    id,
    label,
    desc,
    class: rawclass,
    ...rest
  }: InputProperties<Schema, T> = $props();

  const classes = classParser(rawclass ?? "");
</script>

<Field.Field class={cn("gap-1 min-h-fit", classes.dimensions, classes.spacing)}>
  <Field.Label for={id ?? name}>{label}</Field.Label>
  <input
    {...rest}
    bind:this={ref}
    use:form.manager
    class={cn(
      "border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground shadow-xs flex min-h-9 h-full w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      classes.parsed
    )}
    id={id ?? name}
    {name}
  />
  <Field.Description>{desc}</Field.Description>
  <Field.Error class="text-rose-500">{form.errors.get(name)}</Field.Error>
</Field.Field>
