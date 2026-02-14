import { LogsSubscribeForm, Commitment, LogsFilter } from "../../lib/types";
import AddressInput from "./AddressInput";
import SegmentedControl from "./SegmentedControl";
import { COMMITMENT_OPTIONS, COMMITMENT_TOOLTIP } from "./constants";

const MENTION_PRESETS = [
  {
    label: "Token",
    id: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    description: "SPL Token program — logs for all token operations",
    docsUrl: "https://spl.solana.com/token",
  },
  {
    label: "System",
    id: "11111111111111111111111111111111",
    description: "System program — logs for account creation, SOL transfers, etc.",
    docsUrl: "https://docs.solanalabs.com/runtime/programs#system-program",
  },
  {
    label: "Jupiter v6",
    id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
    description: "Jupiter v6 — logs for DEX aggregator swaps",
    docsUrl: "https://docs.jup.ag/",
  },
  {
    label: "Raydium AMM",
    id: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    description: "Raydium AMM — logs for liquidity pool operations",
    docsUrl: "https://docs.raydium.io/raydium/",
  },
];

const FILTER_OPTIONS = [
  { value: "mentions", label: "mentions" },
  { value: "all", label: "all" },
  { value: "allWithVotes", label: "allWithVotes" },
];

interface Props {
  form: LogsSubscribeForm;
  onFormChange: (form: LogsSubscribeForm) => void;
  addressError?: string;
  onValidateAddress: () => void;
}

export default function LogsSubscribeBuilder({
  form,
  onFormChange,
  addressError,
  onValidateAddress,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        label="Filter"
        tooltip={`mentions - Only transactions that mention a specific address.
all - All transactions except simple vote transactions.
allWithVotes - All transactions including vote transactions.
`}
        options={FILTER_OPTIONS}
        value={form.filter}
        onChange={(v) => onFormChange({ ...form, filter: v as LogsFilter })}
      />
      {form.filter === "mentions" && (
        <AddressInput
          id="mention-address"
          label="Mention Address"
          tooltip="Only receive logs for transactions that mention this address. Accepts a single Pubkey (base-58 encoded)."
          placeholder="11111111111111111111111111111111"
          presets={MENTION_PRESETS}
          value={form.mentionAddress}
          onChange={(mentionAddress) => onFormChange({ ...form, mentionAddress })}
          error={addressError}
          onValidate={onValidateAddress}
        />
      )}
      <SegmentedControl
        label="Commitment"
        tooltip={COMMITMENT_TOOLTIP}
        options={COMMITMENT_OPTIONS}
        value={form.commitment}
        onChange={(v) => onFormChange({ ...form, commitment: v as Commitment })}
      />
    </div>
  );
}
