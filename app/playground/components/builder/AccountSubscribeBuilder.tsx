import { AccountSubscribeForm, Commitment, AccountSubscribeEncoding } from "../../lib/types";
import AddressInput from "./AddressInput";
import SegmentedControl from "./SegmentedControl";
import { COMMITMENT_OPTIONS, COMMITMENT_TOOLTIP } from "./constants";

const ACCOUNT_PRESETS = [
  {
    label: "SOL/USD Pyth",
    id: "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
    description: "Pyth SOL/USD price feed account — real-time oracle price data",
    docsUrl: "https://pyth.network/price-feeds/crypto-sol-usd",
  },
  {
    label: "USDC Mint",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    description: "USDC stablecoin mint account on Solana",
    docsUrl: "https://www.circle.com/usdc",
  },
  {
    label: "Wrapped SOL",
    id: "So11111111111111111111111111111111111111112",
    description: "Wrapped SOL (wSOL) mint account — SPL token representation of native SOL",
    docsUrl: "https://spl.solana.com/token#wrapping-sol",
  },
  {
    label: "mSOL Mint",
    id: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    description: "Marinade staked SOL (mSOL) mint account — liquid staking token",
    docsUrl: "https://marinade.finance/",
  },
];

const ENCODING_OPTIONS = [
  { value: "base58", label: "base58" },
  { value: "base64", label: "base64" },
  { value: "base64+zstd", label: "base64+zstd" },
  { value: "jsonParsed", label: "jsonParsed" },
];

interface Props {
  form: AccountSubscribeForm;
  onFormChange: (form: AccountSubscribeForm) => void;
  addressError?: string;
  onValidateAddress: () => void;
}

export default function AccountSubscribeBuilder({
  form,
  onFormChange,
  addressError,
  onValidateAddress,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <AddressInput
        id="account-id"
        label="Account Address"
        tooltip="Account address to subscribe to. You'll receive updates whenever this specific account's data changes."
        placeholder="H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"
        presets={ACCOUNT_PRESETS}
        value={form.accountId}
        onChange={(accountId) => onFormChange({ ...form, accountId })}
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
          tooltip={`base58 - Standard base58 encoding.
base64 - Standard base64 encoding.
base64+zstd - Compressed.
jsonParsed - Human-readable JSON when a parser exists; else binary.`}
          options={ENCODING_OPTIONS}
          value={form.encoding}
          onChange={(v) => onFormChange({ ...form, encoding: v as AccountSubscribeEncoding })}
        />
      </div>
    </div>
  );
}
