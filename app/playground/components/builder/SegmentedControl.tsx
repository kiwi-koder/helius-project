import Tabs from "../Tabs";
import HelpTooltip from "../HelpTooltip";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  tooltip?: string;
}

export default function SegmentedControl({ options, value, onChange, label, tooltip }: Props) {
  const tabs = options.map((opt) => ({ id: opt.value, label: opt.label }));

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {tooltip && <HelpTooltip text={tooltip} />}
      </label>
      <Tabs tabs={tabs} activeTab={value} onSelect={onChange} />
    </div>
  );
}
