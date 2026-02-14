import { Filter } from "../../lib/types";

interface Props {
  filter: Filter;
  index: number;
  onChange: (index: number, filter: Filter) => void;
  onRemove: (index: number) => void;
  error?: string;
}

export default function FilterRow({ filter, index, onChange, onRemove, error }: Props) {
  return (
    <div className="rounded-md border border-border bg-muted/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-muted p-0.5">
          <button
            onClick={() =>
              onChange(index, { type: "dataSize", value: "" })
            }
            className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
              filter.type === "dataSize"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            dataSize
          </button>
          <button
            onClick={() =>
              onChange(index, { type: "memcmp", offset: "", bytes: "" })
            }
            className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
              filter.type === "memcmp"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            memcmp
          </button>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Remove
        </button>
      </div>

      {filter.type === "dataSize" ? (
        <input
          type="text"
          value={filter.value}
          onChange={(e) =>
            onChange(index, { type: "dataSize", value: e.target.value })
          }
          placeholder="Data size (bytes)"
          className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={filter.offset}
            onChange={(e) =>
              onChange(index, { ...filter, offset: e.target.value })
            }
            placeholder="Offset"
            className="w-24 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="text"
            value={filter.bytes}
            onChange={(e) =>
              onChange(index, { ...filter, bytes: e.target.value })
            }
            placeholder="Bytes (base58)"
            className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
