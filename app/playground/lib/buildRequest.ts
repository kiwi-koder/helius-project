import { FormState, ProgramSubscribeForm, AccountSubscribeForm, LogsSubscribeForm, SignatureSubscribeForm, Filter, SubscriptionMethod } from "./types";

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

function buildProgramSubscribeRequest(form: ProgramSubscribeForm, requestId: number) {
  const filters = form.filters.map(buildFilterParam);

  return {
    jsonrpc: "2.0",
    id: requestId,
    method: "programSubscribe",
    params: [
      form.programId.trim(),
      {
        commitment: form.commitment,
        encoding: form.encoding,
        ...(filters.length > 0 ? { filters } : {}),
      },
    ],
  };
}

function buildAccountSubscribeRequest(form: AccountSubscribeForm, requestId: number) {
  return {
    jsonrpc: "2.0",
    id: requestId,
    method: "accountSubscribe",
    params: [
      form.accountId.trim(),
      {
        commitment: form.commitment,
        encoding: form.encoding,
      },
    ],
  };
}

function buildLogsSubscribeRequest(form: LogsSubscribeForm, requestId: number) {
  const filter =
    form.filter === "mentions"
      ? { mentions: [form.mentionAddress.trim()] }
      : form.filter;

  return {
    jsonrpc: "2.0",
    id: requestId,
    method: "logsSubscribe",
    params: [
      filter,
      {
        commitment: form.commitment,
      },
    ],
  };
}

function buildSignatureSubscribeRequest(form: SignatureSubscribeForm, requestId: number) {
  return {
    jsonrpc: "2.0",
    id: requestId,
    method: "signatureSubscribe",
    params: [
      form.signature.trim(),
      {
        commitment: form.commitment,
        enableReceivedNotification: form.enableReceivedNotification,
      },
    ],
  };
}

const UNSUBSCRIBE_METHODS: Record<SubscriptionMethod, string> = {
  programSubscribe: "programUnsubscribe",
  accountSubscribe: "accountUnsubscribe",
  logsSubscribe: "logsUnsubscribe",
  slotSubscribe: "slotUnsubscribe",
  signatureSubscribe: "signatureUnsubscribe",
  rootSubscribe: "rootUnsubscribe",
};

export function buildRequest(formState: FormState, requestId: number) {
  switch (formState.method) {
    case "programSubscribe":
      return buildProgramSubscribeRequest(formState.programSubscribe, requestId);
    case "accountSubscribe":
      return buildAccountSubscribeRequest(formState.accountSubscribe, requestId);
    case "logsSubscribe":
      return buildLogsSubscribeRequest(formState.logsSubscribe, requestId);
    case "slotSubscribe":
      return {
        jsonrpc: "2.0",
        id: requestId,
        method: "slotSubscribe",
      };
    case "signatureSubscribe":
      return buildSignatureSubscribeRequest(formState.signatureSubscribe, requestId);
    case "rootSubscribe":
      return {
        jsonrpc: "2.0",
        id: requestId,
        method: "rootSubscribe",
      };
    default:
      throw new Error(`Unsupported method: ${formState.method}`);
  }
}

export function buildUnsubscribeRequest(
  method: SubscriptionMethod,
  subscriptionId: number,
  requestId: number,
) {
  return {
    jsonrpc: "2.0",
    id: requestId,
    method: UNSUBSCRIBE_METHODS[method],
    params: [subscriptionId],
  };
}
