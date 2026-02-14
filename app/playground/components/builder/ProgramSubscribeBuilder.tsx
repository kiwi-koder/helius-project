import { ProgramSubscribeForm, Commitment, Encoding, Filter } from "../../lib/types";
import AddressInput from "./AddressInput";
import SegmentedControl from "./SegmentedControl";
import FiltersBuilder from "./FiltersBuilder";
import { COMMITMENT_OPTIONS, COMMITMENT_TOOLTIP } from "./constants";

const PROGRAM_PRESETS = [
  {
    label: "Token",
    id: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    description: "SPL Token program — handles fungible and non-fungible token operations",
    docsUrl: "https://spl.solana.com/token",
  },
  {
    label: "Token-2022",
    id: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    description: "Token Extensions program — adds transfer fees, confidential transfers, and more",
    docsUrl: "https://spl.solana.com/token-2022",
  },
  {
    label: "System",
    id: "11111111111111111111111111111111",
    description: "System program — creates accounts, transfers SOL, and assigns ownership",
    docsUrl: "https://docs.solanalabs.com/runtime/programs#system-program",
  },
  {
    label: "Stake",
    id: "Stake11111111111111111111111111111111111111",
    description: "Stake program — manages SOL staking, delegation, and rewards",
    docsUrl: "https://docs.solanalabs.com/runtime/programs#stake-program",
  },
  {
    label: "Raydium AMM",
    id: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    description: "Raydium AMM — automated market maker for token swaps and liquidity pools",
    docsUrl: "https://docs.raydium.io/raydium/",
  },
  {
    label: "Jupiter v6",
    id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
    description: "Jupiter v6 — DEX aggregator that routes trades across Solana liquidity sources",
    docsUrl: "https://docs.jup.ag/",
  },
];

const ENCODING_OPTIONS = [
  { value: "base64", label: "base64" },
  { value: "base64+zstd", label: "base64+zstd" },
  { value: "jsonParsed", label: "jsonParsed" },
];

interface Props {
  form: ProgramSubscribeForm;
  onFormChange: (form: ProgramSubscribeForm) => void;
  addressError?: string;
  filterErrors?: Record<number, string>;
  onValidateAddress: () => void;
}

export default function ProgramSubscribeBuilder({
  form,
  onFormChange,
  addressError,
  filterErrors,
  onValidateAddress,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <AddressInput
        id="program-id"
        label="Program ID"
        tooltip="Program address to subscribe to. You get updates when any account owned by this program changes."
        placeholder="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        presets={PROGRAM_PRESETS}
        value={form.programId}
        onChange={(programId) => onFormChange({ ...form, programId })}
        error={addressError}
        onValidate={onValidateAddress}
      />
      <div className="grid grid-cols-2 gap-4">
        <SegmentedControl
          label="Commitment"
          tooltip={COMMITMENT_TOOLTIP}
          options={COMMITMENT_OPTIONS}
          value={form.commitment}
          onChange={(v) => onFormChange({ ...form, commitment: v as Commitment })}
        />
        <SegmentedControl
          label="Encoding"
          tooltip={`base64 - Standard encoding.
base64+zstd - Compressed.
jsonParsed - Human-readable JSON when a parser exists; else binary.`}
          options={ENCODING_OPTIONS}
          value={form.encoding}
          onChange={(v) => onFormChange({ ...form, encoding: v as Encoding })}
        />
      </div>
      <FiltersBuilder
        filters={form.filters}
        onChange={(filters: Filter[]) => onFormChange({ ...form, filters })}
        errors={filterErrors}
      />
    </div>
  );
}
