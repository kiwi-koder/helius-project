"use client";
import { useState } from "react";

interface Props {
  text: string;
}

export default function HelpTooltip({ text }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-muted-foreground/40 text-[10px] font-medium leading-none text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground">
        ?
      </span>
      {visible && (
        <div className="pointer-events-none absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-md bg-foreground px-2.5 py-1.5 text-[11px] leading-snug text-background shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </div>
      )}
    </span>
  );
}
