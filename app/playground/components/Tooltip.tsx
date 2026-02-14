"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  content: ReactNode;
  children: ReactNode;
  /** Optional class for the tooltip bubble (e.g. "w-56", "w-64 max-w-xs"). Default: "w-56". */
  contentClassName?: string;
  /** Optional class for the wrapper (e.g. "w-full" so tooltip trigger fills flex parent). */
  wrapperClassName?: string;
}

export default function Tooltip({
  content,
  children,
  contentClassName = "w-56",
  wrapperClassName = "",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const show = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setVisible(true);
  };

  const hide = () => {
    hideTimeoutRef.current = setTimeout(() => setVisible(false), 100);
  };

  useEffect(() => {
    if (!visible || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      left: rect.left + rect.width / 2,
      top: rect.top,
    });
  }, [visible]);

  const tooltipContent =
    visible && position && typeof document !== "undefined" ? (
      createPortal(
        <div
          className={`pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-full whitespace-pre-line ${contentClassName} rounded-md bg-foreground px-2.5 py-1.5 text-[11px] leading-snug text-background shadow-lg`}
          style={{
            left: position.left,
            top: position.top - 8,
          }}
          role="tooltip"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </div>,
        document.body
      )
    ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        className={`relative inline-flex ${wrapperClassName}`.trim()}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}
