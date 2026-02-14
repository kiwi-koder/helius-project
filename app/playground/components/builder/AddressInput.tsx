import HelpTooltip from "../HelpTooltip";
import Tooltip from "../Tooltip";
import ExternalLinkIcon from "../ExternalLinkIcon";

interface Preset {
  label: string;
  id: string;
  description: string;
  docsUrl?: string;
}

interface Props {
  id: string;
  label: string;
  tooltip: string;
  placeholder: string;
  presets: Preset[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onValidate: () => void;
}

export default function AddressInput({
  id,
  label,
  tooltip,
  placeholder,
  presets,
  value,
  onChange,
  error,
  onValidate,
}: Props) {
  const selectedPreset = presets.find((p) => p.id === value);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {label}
          <HelpTooltip text={tooltip} />
        </label>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {presets.map((preset) => (
            <Tooltip key={preset.id} content={preset.description} contentClassName="w-52">
              <button
                type="button"
                onClick={() => onChange(preset.id)}
                className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                  value === preset.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {preset.label}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onValidate}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      />
      {selectedPreset?.docsUrl && (
        <a
          href={selectedPreset.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View {selectedPreset.label} docs
          <ExternalLinkIcon />
        </a>
      )}
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
