import Tabs from "./Tabs";

const METHODS = [
  { id: "programSubscribe", label: "programSubscribe" },
  { id: "accountSubscribe", label: "accountSubscribe", disabled: true },
  { id: "logsSubscribe", label: "logsSubscribe", disabled: true },
  { id: "slotSubscribe", label: "slotSubscribe", disabled: true },
  { id: "signatureSubscribe", label: "signatureSubscribe", disabled: true },
  { id: "rootSubscribe", label: "rootSubscribe", disabled: true },
];

interface Props {
  activeMethod: string;
  onSelect: (method: string) => void;
}

export default function MethodTabs({ activeMethod, onSelect }: Props) {
  return (
    <Tabs
      tabs={METHODS}
      activeTab={activeMethod}
      onSelect={onSelect}
      className="mb-4"
      expanded={true}
    />
  );
}
