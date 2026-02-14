import { useState } from "react";
import { FormState, SubscriptionMethod } from "../lib/types";
import BuilderForm from "./builder/BuilderForm";
import RawJsonPreview from "./RawJsonPreview";
import { buildRequest } from "../lib/buildRequest";
import Tabs from "./Tabs";
import HelpTooltip from "./HelpTooltip";
import ExternalLinkIcon from "./ExternalLinkIcon";

const SUB_TABS = [
  { id: "builder", label: "Builder" },
  { id: "raw", label: "Raw JSON" },
];

const DOCS_URLS: Record<SubscriptionMethod, string> = {
  programSubscribe:
    "https://www.helius.dev/docs/api-reference/rpc/websocket/programsubscribe",
  accountSubscribe:
    "https://www.helius.dev/docs/api-reference/rpc/websocket/accountsubscribe",
  logsSubscribe:
    "https://www.helius.dev/docs/api-reference/rpc/websocket/logssubscribe",
  slotSubscribe:
    "https://www.helius.dev/docs/api-reference/rpc/websocket/slotsubscribe",
  signatureSubscribe:
    "https://www.helius.dev/docs/api-reference/rpc/websocket/signaturesubscribe",
  rootSubscribe:
    "https://www.helius.dev/docs/api-reference/rpc/websocket/rootsubscribe",
};

interface Props {
  activeMethod: SubscriptionMethod;
  form: FormState;
  onFormChange: (form: FormState) => void;
  addressError?: string;
  filterErrors?: Record<number, string>;
  onValidateAddress: () => void;
}

export default function RequestBuilderCard({
  activeMethod,
  form,
  onFormChange,
  addressError,
  filterErrors,
  onValidateAddress,
}: Props) {
  const [subTab, setSubTab] = useState("builder");

  let previewRequest: object | null = null;
  try {
    previewRequest = buildRequest(form, 1);
  } catch {
    // method not yet supported — preview will be null
  }

  const docsUrl = DOCS_URLS[activeMethod];

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          Request Builder
          <HelpTooltip text="Configure your WebSocket subscription request. Use the Builder tab for a guided form or the Raw JSON tab to see the generated request payload." />
        </h2>
        {docsUrl && (
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            View {activeMethod} docs
            <ExternalLinkIcon />
          </a>
        )}
      </div>

      <Tabs
        tabs={SUB_TABS}
        activeTab={subTab}
        onSelect={setSubTab}
        className="mb-4"
      />

      {subTab === "builder" ? (
        <BuilderForm
          activeMethod={activeMethod}
          form={form}
          onFormChange={onFormChange}
          addressError={addressError}
          filterErrors={filterErrors}
          onValidateAddress={onValidateAddress}
        />
      ) : previewRequest ? (
        <RawJsonPreview json={previewRequest} />
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Raw JSON preview not available for {activeMethod} yet.
        </div>
      )}
    </div>
  );
}
