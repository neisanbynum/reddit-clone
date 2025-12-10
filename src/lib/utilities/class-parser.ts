import { cn } from "$lib/utils";
import type { ClassValue } from "svelte/elements";

const DimensionRegex = new RegExp(
  /((?:(?:(?:max-)?(?:sm|md|lg|xl|2xl|3xl|4xl):)){0,2}(?:(?:max|min)-)?(?:w|h)-(?:[a-z0-9/_]+|\[[a-z0-9/_]+\]))/
);
const SpacingRegex = new RegExp(
  /((?:(?:(?:max-)?(?:sm|md|lg|xl|2xl|3xl|4xl):)){0,2}(?:(?:(?:p|m|-m)(?:x|y|s|e|t|r|b|l)?))(?:[0-9]+|[0-9]+\/[0-9]+|px|full|auto|\(--[a-zA-Z0-9-]+\)|\[[a-zA-Z0-9_]\]))/
);
const PositionRegex = new RegExp(
  /((?:(?:(?:max-)?(?:sm|md|lg|xl|2xl|3xl|4xl):)){0,2}(?:static|fixed|absolute|relative|sticky|(?:(?:(?:-)?(?:inset|inset-x|inset-y|start|end|top|right|bottom|left|z))(?:[0-9]+|[0-9]+\/[0-9]+|px|full|auto|\(--[a-zA-Z0-9-]+\)|\[[a-zA-Z0-9_]\]))))/
);
const FontFamilyRegex = new RegExp(
  /((?:(?:(?:max-)?(?:sm|md|lg|xl|2xl|3xl|4xl):)){0,2}font-(?:sans|serif|mono|\(family-name:--[a-zA-Z-]+\)|\[[a-zA-Z_]+\]))/
);
const FontSizeRegex = new RegExp(
  /((?:(?:(?:max-)?(?:sm|md|lg|xl|2xl|3xl|4xl):)){0,2}text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\(length:--[a-zA-Z0-9-]+\)|\[[0-9a-zA-Z_]+\])(?:\/[0-9]+)?)/
);

export function classParser(...classes: Array<ClassValue>) {
  const original: string = cn(classes);
  let parsed: string = original;
  const dimensions: Array<string> = [];
  const spacing: Array<string> = [];
  const position: Array<string> = [];
  const typyography: Array<string> = [];

  while (DimensionRegex.test(parsed)) {
    const match = DimensionRegex.exec(parsed);
    if (match === null) continue;
    dimensions.push(match[0]);
    parsed = parsed.replace(DimensionRegex, "");
  }

  while (SpacingRegex.test(parsed)) {
    const match = SpacingRegex.exec(parsed);
    if (match === null) continue;
    dimensions.push(match[0]);
    parsed = parsed.replace(SpacingRegex, "");
  }

  while (PositionRegex.test(parsed)) {
    const match = PositionRegex.exec(parsed);
    if (match === null) continue;
    position.push(match[0]);
    parsed = parsed.replace(PositionRegex, "");
  }

  while (FontFamilyRegex.test(parsed)) {
    const match = FontFamilyRegex.exec(parsed);
    if (match === null) continue;
    typyography.push(match[0]);
    parsed = parsed.replace(FontFamilyRegex, "");
  }

  while (FontSizeRegex.test(parsed)) {
    const match = FontSizeRegex.exec(parsed);
    if (match === null) continue;
    typyography.push(match[0]);
    parsed = parsed.replace(FontSizeRegex, "");
  }

  return {
    dimensions: dimensions.join(" "),
    spacing: spacing.join(" "),
    position: position.join(" "),
    typyography: typyography.join(" "),
    original,
    parsed,
  } as const;
}
