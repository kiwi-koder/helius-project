import { Filter } from "../../lib/types";
import FilterRow from "./FilterRow";

interface Props {
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
  errors?: Record<number, string>;
}

export default function FiltersBuilder({ filters, onChange, errors }: Props) {
  const handleFilterChange = (index: number, filter: Filter) => {
    const next = [...filters];
    next[index] = filter;
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(filters.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...filters, { type: "dataSize", value: "" }]);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Filters <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <button
          onClick={handleAdd}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          + Add filter
        </button>
      </div>
      {filters.length > 0 && (
        <div className="flex flex-col gap-2">
          {filters.map((filter, i) => (
            <FilterRow
              key={i}
              filter={filter}
              index={i}
              onChange={handleFilterChange}
              onRemove={handleRemove}
              error={errors?.[i]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
