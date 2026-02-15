/** Message sent from the client to the proxy to start a subscription. */
export interface ClientSubscribeMessage {
  action: "subscribe";
  method: string;
  params?: unknown[];
}

/** Message sent from the client to the proxy to cancel an active subscription. */
export interface ClientUnsubscribeMessage {
  action: "unsubscribe";
  subscriptionId: string;
}

/**
 * WebSocket connection state.
 * - `disconnected` — no active connection
 * - `connecting` — handshake in progress
 * - `connected` — socket open and ready
 * - `error` — connection failed or dropped unexpectedly
 */
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

/**
 * Subscription lifecycle state.
 * - `idle` — no subscription requested
 * - `subscribing` — subscribe message sent, awaiting confirmation
 * - `active` — subscription confirmed, receiving notifications
 * - `error` — subscription rejected or failed
 */
export type SubscriptionStatus = "idle" | "subscribing" | "active" | "error";

/** Solana commitment level used for subscription confirmations. */
export type Commitment = "confirmed" | "finalized" | "processed";

/** Encoding format for `programSubscribe` account data. */
export type Encoding = "base64" | "base64+zstd" | "jsonParsed";

/** Encoding format for `accountSubscribe` account data (includes `base58`). */
export type AccountSubscribeEncoding = "base58" | "base64" | "base64+zstd" | "jsonParsed";

/** Discriminator for the two supported Solana account data filter kinds. */
export type FilterType = "dataSize" | "memcmp";

/** Filter that matches accounts whose data length equals the given value. */
export interface DataSizeFilter {
  type: "dataSize";
  value: string;
}

/** Filter that matches accounts whose data at `offset` equals the given `bytes`. */
export interface MemcmpFilter {
  type: "memcmp";
  offset: string;
  bytes: string;
}

/** A Solana account data filter — either a data-size check or a byte-comparison (memcmp). */
export type Filter = DataSizeFilter | MemcmpFilter;

/** All WebSocket subscription methods supported by the playground. */
export type SubscriptionMethod =
  | "programSubscribe"
  | "accountSubscribe"
  | "logsSubscribe"
  | "slotSubscribe"
  | "signatureSubscribe"
  | "rootSubscribe";

/** Form fields for `programSubscribe`. */
export interface ProgramSubscribeForm {
  programId: string;
  commitment: Commitment;
  encoding: Encoding;
  filters: Filter[];
}

/** Form fields for `accountSubscribe`. */
export interface AccountSubscribeForm {
  accountId: string;
  commitment: Commitment;
  encoding: AccountSubscribeEncoding;
}

/** Log filter mode — all transactions, all including votes, or only those mentioning a specific address. */
export type LogsFilter = "all" | "allWithVotes" | "mentions";

/** Form fields for `logsSubscribe`. */
export interface LogsSubscribeForm {
  filter: LogsFilter;
  mentionAddress: string;
  commitment: Commitment;
}

/** Form fields for `signatureSubscribe`. */
export interface SignatureSubscribeForm {
  signature: string;
  commitment: Commitment;
  enableReceivedNotification: boolean;
}

export type MethodForm = {
  method: "programSubscribe";
} & ProgramSubscribeForm;

/** Top-level form state holding the selected method and per-method form data. */
export interface FormState {
  method: SubscriptionMethod;
  programSubscribe: ProgramSubscribeForm;
  accountSubscribe: AccountSubscribeForm;
  logsSubscribe: LogsSubscribeForm;
  signatureSubscribe: SignatureSubscribeForm;
}

/**
 * A single entry in the event log panel.
 * - `type` indicates the event kind (sent request, received notification, error, or informational).
 */
export interface LogEvent {
  id: string;
  timestamp: Date;
  type: "sent" | "received" | "error" | "info";
  data: string;
}

/** Validation error messages keyed by field — `address` for the primary input, `filters` indexed by row. */
export interface ValidationErrors {
  url?: string;
  address?: string;
  filters?: Record<number, string>;
}
