import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onValidate: () => void;
}

export default function WebSocketUrlInput({ value, onChange, error, onValidate }: Props) {
  return (
    <div className="mb-4">
      <label htmlFor="ws-url" className="mb-1.5 block text-sm font-medium text-foreground">
        WebSocket URL
      </label>
      <input
        id="ws-url"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onValidate}
        placeholder="wss://mainnet.helius-rpc.com/?api-key=********************************"
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
