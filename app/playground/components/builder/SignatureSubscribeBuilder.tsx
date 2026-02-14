import { SignatureSubscribeForm, Commitment } from "../../lib/types";
import AddressInput from "./AddressInput";
import SegmentedControl from "./SegmentedControl";
import HelpTooltip from "../HelpTooltip";
import { COMMITMENT_OPTIONS, COMMITMENT_TOOLTIP } from "./constants";

const SIGNATURE_PRESETS = [
  {
    label: "Example 1",
    id: "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
    description: "Sample transaction signature from the Solana docs",
  },
  {
    label: "Example 2",
    id: "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW",
    description: "Sample transaction signature for testing",
  },
];

interface Props {
  form: SignatureSubscribeForm;
  onFormChange: (form: SignatureSubscribeForm) => void;
  addressError?: string;
  onValidateAddress: () => void;
}

export default function SignatureSubscribeBuilder({
  form,
  onFormChange,
  addressError,
  onValidateAddress,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <AddressInput
        id="signature"
        label="Transaction Signature"
        tooltip="Base-58 encoded transaction signature. You'll be notified when this transaction reaches the specified commitment level. The subscription auto-cancels after one notification."
        placeholder="2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b"
        presets={SIGNATURE_PRESETS}
        value={form.signature}
        onChange={(signature) => onFormChange({ ...form, signature })}
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
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            Received Notification
            <HelpTooltip text="When enabled, you'll receive an extra notification when the validator first receives the signature, before it reaches the target commitment level." />
          </label>
          <button
            type="button"
            onClick={() => onFormChange({ ...form, enableReceivedNotification: !form.enableReceivedNotification })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.enableReceivedNotification ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                form.enableReceivedNotification ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
