import Tabs from "./Tabs";

const METHODS = [
  { id: "programSubscribe", label: "programSubscribe" },
  { id: "accountSubscribe", label: "accountSubscribe" },
  { id: "logsSubscribe", label: "logsSubscribe" },
  { id: "slotSubscribe", label: "slotSubscribe" },
  { id: "signatureSubscribe", label: "signatureSubscribe" },
  { id: "rootSubscribe", label: "rootSubscribe" },
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
