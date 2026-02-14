import { FormState, ProgramSubscribeForm, Filter, SubscriptionMethod } from "./types";

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
