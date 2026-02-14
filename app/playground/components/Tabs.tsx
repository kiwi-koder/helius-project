"use client";

import Tooltip from "./Tooltip";

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onSelect: (id: string) => void;
  expanded?: boolean;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onSelect,
  expanded = false,
  className = "",
}: Props) {
  return (
    <div className={`max-w-full overflow-x-auto ${className}`}>
      <div
        className={`inline-flex gap-1 rounded-md bg-muted p-1 ${expanded ? "w-full" : ""}`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const button = (
            <button
              onClick={() => !tab.disabled && onSelect(tab.id)}
              disabled={tab.disabled}
              aria-selected={activeTab === tab.id}
              aria-disabled={tab.disabled}
              role="tab"
              className={`w-full whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                expanded ? "text-center" : ""
              } ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : tab.disabled
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );

          return (
            <span
              key={tab.id}
              className={`relative inline-flex ${expanded ? "flex-1" : ""}`}
            >
              {tab.tooltip ? (
                <Tooltip
                  content={tab.tooltip}
                  contentClassName="w-64"
                  wrapperClassName="w-full"
                >
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
