import Tabs from "../Tabs";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function SegmentedControl({ options, value, onChange, label }: Props) {
  const tabs = options.map((opt) => ({ id: opt.value, label: opt.label }));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <Tabs tabs={tabs} activeTab={value} onSelect={onChange} />
    </div>
  );
}
