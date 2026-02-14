export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export type SubscriptionStatus = "idle" | "subscribing" | "active" | "error";

export type Commitment = "confirmed" | "finalized" | "processed";

export type Encoding = "base64" | "base64+zstd" | "jsonParsed";

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

export type MethodForm = {
  method: "programSubscribe";
} & ProgramSubscribeForm;

export interface FormState {
  method: SubscriptionMethod;
  programSubscribe: ProgramSubscribeForm;
}

export interface LogEvent {
  id: string;
  timestamp: Date;
  type: "sent" | "received" | "error" | "info";
  data: string;
}

export interface ValidationErrors {
  url?: string;
  programId?: string;
  filters?: Record<number, string>;
}
