interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onSelect(tab.id)}
            disabled={tab.disabled}
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            role="tab"
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              expanded ? "flex-1 text-center" : ""
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
        ))}
      </div>
    </div>
  );
}
