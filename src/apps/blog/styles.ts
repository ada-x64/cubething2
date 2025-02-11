/////////////////////////////// cubething.dev /////////////////////////////////

export function TwClass(
  params:
    | {
        light?: string[];
        dark?: string[];
      }
    | string[],
) {
  if (Array.isArray(params)) {
    return params.join(" ");
  } else {
    return [
      params.light?.join(" "),
      params.dark?.map((item) => `dark:${item}`).join(" "),
    ].join(" ");
  }
}

export const Palette = {
  text: "text-amber-950 dark:text-zinc-100",
  secondaryText: "text-amber-950 font-thin dark:text-zinc-100",
  accentText: "text-amber-600 dark:text-amber-500",
  accentTextHover: "hover:text-amber-600 hover:dark:text-amber-500",
  accentTextFocus: "focus:text-amber-600 focus:dark:text-amber-500",
  bg: "bg-amber-50 dark:bg-zinc-900",
  borderColor: "border-amber-950 dark:border-zinc-500",
};

export const Link = TwClass([
  Palette.text,
  "font-bold",
  "transition",
  "ease-linear",
  "duration-100",
]);

export const OutboundIndicator = TwClass([
  "after:text-xs",
  "after:align-bottom",
  // "after:content-['🡵']",
  "after:content-['➚']",
]);

export const InboundIndicator = TwClass([
  "after:text-xs",
  "after:align-bottom",
  "after:content-['#']",
]);

export const OutboundLink = TwClass([
  Link,
  OutboundIndicator,
  Palette.accentTextFocus,
  Palette.accentTextHover,
]);

export const LocalAction = TwClass([Link]);
export const InboundLink = TwClass([LocalAction, InboundIndicator]);

export const ItemSelectedStyle = TwClass([
  "line-through",
  Palette.secondaryText,
]);
export const ItemStyle = TwClass([
  "px-2",
  "py-1",
  "mb-1",
  "rounded-sm",
  "text-base",
  "text-center",
  "transition",
]);

export const ItemListStyle = TwClass(["flex", "flex-col"]);
export const ItemContainerStyle = TwClass([
  "flex",
  "flex-col",
  "flex-shrink-0",
  "items-center",
  "py-4",
  "border-b",
  Palette.borderColor,
  "w-full",
  "text-4xl",
]);

export const TimeStyle = Palette.secondaryText;
