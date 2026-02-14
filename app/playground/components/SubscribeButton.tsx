import { SubscriptionStatus, ConnectionStatus } from "../lib/types";

interface Props {
  connectionStatus: ConnectionStatus;
  subscriptionStatus: SubscriptionStatus;
  disabled: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

export default function SubscribeButton({
  connectionStatus,
  subscriptionStatus,
  disabled,
  onSubscribe,
  onUnsubscribe,
}: Props) {
  const isActive = subscriptionStatus === "active";
  const isLoading =
    connectionStatus === "connecting" || subscriptionStatus === "subscribing";

  if (isActive) {
    return (
      <button
        onClick={onUnsubscribe}
        className="w-full rounded-md bg-destructive px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-destructive/90"
      >
        Unsubscribe
      </button>
    );
  }

  return (
    <button
      onClick={onSubscribe}
      disabled={disabled || isLoading}
      className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Connecting..." : "Create subscription"}
    </button>
  );
}
