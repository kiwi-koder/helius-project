export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export type SubscriptionStatus = "idle" | "subscribing" | "active" | "error";

export type Commitment = "confirmed" | "finalized" | "processed";

export type Encoding = "base64" | "base64+zstd" | "jsonParsed";

export type AccountSubscribeEncoding = "base58" | "base64" | "base64+zstd" | "jsonParsed";

export type FilterType = "dataSize" | "memcmp";

export interface DataSizeFilter {
  type: "dataSize";
  value: string;
}

export interface MemcmpFilter {
  type: "memcmp";
  offset: string;
  bytes: string;
}

export type Filter = DataSizeFilter | MemcmpFilter;

export type SubscriptionMethod =
  | "programSubscribe"
  | "accountSubscribe"
  | "logsSubscribe"
  | "slotSubscribe"
  | "signatureSubscribe"
  | "rootSubscribe";

export interface ProgramSubscribeForm {
  programId: string;
  commitment: Commitment;
  encoding: Encoding;
  filters: Filter[];
}

export interface AccountSubscribeForm {
  accountId: string;
  commitment: Commitment;
  encoding: AccountSubscribeEncoding;
}

export type LogsFilter = "all" | "allWithVotes" | "mentions";

export interface LogsSubscribeForm {
  filter: LogsFilter;
  mentionAddress: string;
  commitment: Commitment;
}

export interface SignatureSubscribeForm {
  signature: string;
  commitment: Commitment;
  enableReceivedNotification: boolean;
}

export type MethodForm = {
  method: "programSubscribe";
} & ProgramSubscribeForm;

export interface FormState {
  method: SubscriptionMethod;
  programSubscribe: ProgramSubscribeForm;
  accountSubscribe: AccountSubscribeForm;
  logsSubscribe: LogsSubscribeForm;
  signatureSubscribe: SignatureSubscribeForm;
}

export interface LogEvent {
  id: string;
  timestamp: Date;
  type: "sent" | "received" | "error" | "info";
  data: string;
}

export interface ValidationErrors {
  url?: string;
  address?: string;
  filters?: Record<number, string>;
}
