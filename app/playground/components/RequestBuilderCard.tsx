import { useState } from "react";
import { FormState, SubscriptionMethod } from "../lib/types";
import BuilderForm from "./builder/BuilderForm";
import RawJsonPreview from "./RawJsonPreview";
import { buildRequest } from "../lib/buildRequest";
import Tabs from "./Tabs";

const SUB_TABS = [
  { id: "builder", label: "Builder" },
  { id: "raw", label: "Raw JSON" },
];

const DOCS_URLS: Partial<Record<SubscriptionMethod, string>> = {
  programSubscribe:
    "https://www.helius.dev/docs/api-reference/rpc/websocket/programsubscribe",
};

interface Props {
  activeMethod: SubscriptionMethod;
  form: FormState;
  onFormChange: (form: FormState) => void;
  programIdError?: string;
  filterErrors?: Record<number, string>;
  onValidateProgramId: () => void;
}

export default function RequestBuilderCard({
  activeMethod,
  form,
  onFormChange,
  programIdError,
  filterErrors,
  onValidateProgramId,
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
        <h2 className="text-sm font-semibold text-foreground">Request Builder</h2>
        {docsUrl && (
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Docs
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
          programIdError={programIdError}
          filterErrors={filterErrors}
          onValidateProgramId={onValidateProgramId}
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
