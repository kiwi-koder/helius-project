import HelpTooltip from "./HelpTooltip";
import ExternalLinkIcon from "./ExternalLinkIcon";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onValidate: () => void;
  minimal?: boolean;
}

export default function WebSocketUrlInput({ value, onChange, error, onValidate, minimal = false }: Props) {
  return (
    <div className={minimal ? "mb-0" : "mb-4"}>
      {!minimal && (
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="ws-url" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            WebSocket URL
            <HelpTooltip text="The Helius WebSocket endpoint URL including your API key. Used to establish a real-time streaming connection to the Solana network." />
          </label>
          <a
            href="https://dashboard.helius.dev/websockets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Get your URL
            <ExternalLinkIcon />
          </a>
        </div>
      )}
      <input
        id="ws-url"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onValidate}
        placeholder="wss://mainnet.helius-rpc.com/?api-key=********************************"
        className={`w-full rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
          minimal ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
      {minimal && (
        <div className="mt-3 text-center">
          <a
            href="https://dashboard.helius.dev/websockets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Get your URL
            <ExternalLinkIcon />
          </a>
        </div>
      )}
    </div>
  );
}
