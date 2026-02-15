import { FormState, ProgramSubscribeForm, AccountSubscribeForm, LogsSubscribeForm, SignatureSubscribeForm, Filter, SubscriptionMethod, ClientSubscribeMessage, ClientUnsubscribeMessage } from "./types";

/** Convert a UI {@link Filter} into the Solana RPC filter format (`{ dataSize }` or `{ memcmp }`). */
function buildFilterParam(filter: Filter): object {
  if (filter.type === "dataSize") {
    return { dataSize: parseInt(filter.value, 10) };
  }
  return {
    memcmp: {
      offset: parseInt(filter.offset, 10),
      bytes: filter.bytes.trim(),
    },
  };
}

/** Build the `params` array for a `programSubscribe` RPC call. */
function buildProgramSubscribeParams(form: ProgramSubscribeForm): unknown[] {
  const filters = form.filters.map(buildFilterParam);

  return [
    form.programId.trim(),
    {
      commitment: form.commitment,
      encoding: form.encoding,
      ...(filters.length > 0 ? { filters } : {}),
    },
  ];
}

/** Build the `params` array for an `accountSubscribe` RPC call. */
function buildAccountSubscribeParams(form: AccountSubscribeForm): unknown[] {
  return [
    form.accountId.trim(),
    {
      commitment: form.commitment,
      encoding: form.encoding,
    },
  ];
}

/** Build the `params` array for a `logsSubscribe` RPC call. */
function buildLogsSubscribeParams(form: LogsSubscribeForm): unknown[] {
  const filter =
    form.filter === "mentions"
      ? { mentions: [form.mentionAddress.trim()] }
      : form.filter;

  return [
    filter,
    {
      commitment: form.commitment,
    },
  ];
}

/** Build the `params` array for a `signatureSubscribe` RPC call. */
function buildSignatureSubscribeParams(form: SignatureSubscribeForm): unknown[] {
  return [
    form.signature.trim(),
    {
      commitment: form.commitment,
      enableReceivedNotification: form.enableReceivedNotification,
    },
  ];
}

/** Route the current form state to the correct per-method param builder and return the method name + params. */
function getMethodAndParams(formState: FormState): { method: string; params: unknown[] } {
  const method = formState.method;
  let params: unknown[] = [];

  switch (method) {
    case "programSubscribe":
      params = buildProgramSubscribeParams(formState.programSubscribe);
      break;
    case "accountSubscribe":
      params = buildAccountSubscribeParams(formState.accountSubscribe);
      break;
    case "logsSubscribe":
      params = buildLogsSubscribeParams(formState.logsSubscribe);
      break;
    case "signatureSubscribe":
      params = buildSignatureSubscribeParams(formState.signatureSubscribe);
      break;
    case "slotSubscribe":
    case "rootSubscribe":
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }

  return { method, params };
}

/** Build a proxy-format subscribe message: { action, method, params } (client → proxy) */
export function buildRequest(formState: FormState): ClientSubscribeMessage {
  const { method, params } = getMethodAndParams(formState);
  return { action: "subscribe" as const, method, params };
}

/** Build the JSON-RPC message the proxy sends to the Helius WebSocket (for Raw JSON preview) */
export function buildHeliusRequest(formState: FormState): { jsonrpc: "2.0"; id: number; method: string; params: unknown[] } {
  const { method, params } = getMethodAndParams(formState);
  return { jsonrpc: "2.0", id: 1, method, params };
}

/** Build a proxy-format unsubscribe message */
export function buildUnsubscribeRequest(subscriptionId: string): ClientUnsubscribeMessage {
  return { action: "unsubscribe", subscriptionId };
}
