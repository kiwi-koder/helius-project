import { ConnectionStatus, SubscriptionStatus } from "../lib/types";

interface Props {
  connectionStatus: ConnectionStatus;
  subscriptionStatus: SubscriptionStatus;
}

const CONNECTION_COLORS: Record<ConnectionStatus, string> = {
  disconnected: "bg-muted-foreground",
  connecting: "bg-yellow-500",
  connected: "bg-success",
  error: "bg-destructive",
};

const SUBSCRIPTION_LABELS: Record<SubscriptionStatus, string> = {
  idle: "No subscription",
  subscribing: "Subscribing...",
  active: "Subscription active",
  error: "Subscription error",
};

export default function StatusBar({ connectionStatus, subscriptionStatus }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className={`inline-block h-2 w-2 rounded-full ${CONNECTION_COLORS[connectionStatus]}`} />
        <span className="capitalize">{connectionStatus}</span>
      </div>
      <span className="text-border">|</span>
      <span>{SUBSCRIPTION_LABELS[subscriptionStatus]}</span>
    </div>
  );
}
