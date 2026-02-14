import { useLayoutEffect, useRef, useCallback, useMemo, useState, memo } from "react";
import { LogEvent } from "../lib/types";

interface Props {
  events: LogEvent[];
  onClearLogs: () => void;
}

const TYPE_COLORS: Record<LogEvent["type"], string> = {
  sent: "text-primary",
  received: "text-success",
  error: "text-destructive",
  info: "text-muted-foreground",
};

const MAX_DISPLAY = 200;

function formatTimestamp(date: Date) {
  return date.toLocaleTimeString("en-US", { hour12: false, fractionalSecondDigits: 3 });
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

const EventRow = memo(function EventRow({ event }: { event: LogEvent }) {
  return (
    <div className="mb-1">
      <span className="text-muted-foreground mr-2">{formatTimestamp(event.timestamp)}</span>
      <span className={`mr-2 uppercase font-semibold ${TYPE_COLORS[event.type]}`}>
        [{event.type}]
      </span>
      <span className="text-foreground break-all">{event.data}</span>
    </div>
  );
});

export default function LogsPanel({ events, onClearLogs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const isProgScrollRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);

  const displayEvents = useMemo(
    () => (events.length > MAX_DISPLAY ? events.slice(-MAX_DISPLAY) : events),
    [events]
  );

  const handleScroll = useCallback(() => {
    if (isProgScrollRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    autoScrollRef.current = distFromBottom < 50;
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el && autoScrollRef.current) {
      isProgScrollRef.current = true;
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
        // Reset flag after browser processes the scroll event
        requestAnimationFrame(() => {
          isProgScrollRef.current = false;
        });
      });
    }
  }, [events.length]);

  const handleCopyLogs = () => {
    const logText = displayEvents
      .filter((e) => e.type === "received")
      .map((e) => e.data)
      .join("\n");
    if (logText) {
      navigator.clipboard.writeText(logText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleClear = () => {
    onClearLogs();
    setCleared(true);
    setTimeout(() => setCleared(false), 1500);
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 className="text-sm font-semibold text-foreground">
          Events
          {events.length > 0 && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({events.length}{events.length > MAX_DISPLAY ? `, showing last ${MAX_DISPLAY}` : ""})
            </span>
          )}
        </h2>
        <div className="flex gap-1">
          <div className="relative group">
            <button
              onClick={handleCopyLogs}
              disabled={events.length === 0}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              {copied ? (
                <CheckIcon className="w-3.5 h-3.5 text-success" />
              ) : (
                <CopyIcon className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] text-background opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? "Copied!" : "Copy logs"}
            </span>
          </div>
          <div className="relative group">
            <button
              onClick={handleClear}
              disabled={events.length === 0}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              {cleared ? (
                <CheckIcon className="w-3.5 h-3.5 text-success" />
              ) : (
                <ClearIcon className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] text-background opacity-0 group-hover:opacity-100 transition-opacity">
              {cleared ? "Cleared!" : "Clear logs"}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(0 0% 25%) transparent' }}
        className="overflow-auto p-4 font-mono text-xs leading-relaxed h-[200px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[hsl(0_0%_25%)] hover:[&::-webkit-scrollbar-thumb]:bg-[hsl(0_0%_35%)]"
      >
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No events yet. Create a subscription to start receiving data.
          </p>
        ) : (
          displayEvents.map((event) => (
            <EventRow key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
