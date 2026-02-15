import HelpTooltip from "../HelpTooltip";
import Tooltip from "../Tooltip";

const PRESETS = [
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

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onValidate: () => void;
}

export default function ProgramIdInput({ value, onChange, error, onValidate }: Props) {
  const selectedPreset = PRESETS.find((p) => p.id === value);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor="program-id" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          Program ID
          <HelpTooltip text="Program address to subscribe to. You get updates when any account owned by this program changes." />
        </label>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {PRESETS.map((preset) => (
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
        id="program-id"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onValidate}
        placeholder="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      />
      {selectedPreset && (
        <a
          href={selectedPreset?.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View {selectedPreset?.label} docs
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
            <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
          </svg>
        </a>
      )}
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
