"use client";

import Tooltip from "./Tooltip";

interface Props {
  text: string;
}

export default function HelpTooltip({ text }: Props) {
  return (
    <Tooltip content={text}>
      <span className="inline-grid h-4 w-4 shrink-0 place-items-center cursor-help rounded-full border border-muted-foreground/40 text-[10px] font-medium leading-none text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground">
        ?
      </span>
    </Tooltip>
  );
}
