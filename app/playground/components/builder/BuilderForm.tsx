import { FormState, ProgramSubscribeForm, AccountSubscribeForm, LogsSubscribeForm, SignatureSubscribeForm, SubscriptionMethod } from "../../lib/types";
import ProgramSubscribeBuilder from "./ProgramSubscribeBuilder";
import AccountSubscribeBuilder from "./AccountSubscribeBuilder";
import LogsSubscribeBuilder from "./LogsSubscribeBuilder";
import SignatureSubscribeBuilder from "./SignatureSubscribeBuilder";

interface Props {
  activeMethod: SubscriptionMethod;
  form: FormState;
  onFormChange: (form: FormState) => void;
  addressError?: string;
  filterErrors?: Record<number, string>;
  onValidateAddress: () => void;
}

export default function BuilderForm({
  activeMethod,
  form,
  onFormChange,
  addressError,
  filterErrors,
  onValidateAddress,
}: Props) {
  switch (activeMethod) {
    case "programSubscribe":
      return (
        <ProgramSubscribeBuilder
          form={form.programSubscribe}
          onFormChange={(updated: ProgramSubscribeForm) =>
            onFormChange({ ...form, programSubscribe: updated })
          }
          addressError={addressError}
          filterErrors={filterErrors}
          onValidateAddress={onValidateAddress}
        />
      );
    case "accountSubscribe":
      return (
        <AccountSubscribeBuilder
          form={form.accountSubscribe}
          onFormChange={(updated: AccountSubscribeForm) =>
            onFormChange({ ...form, accountSubscribe: updated })
          }
          addressError={addressError}
          onValidateAddress={onValidateAddress}
        />
      );
    case "logsSubscribe":
      return (
        <LogsSubscribeBuilder
          form={form.logsSubscribe ?? { filter: "mentions", mentionAddress: "", commitment: "confirmed" }}
          onFormChange={(updated: LogsSubscribeForm) =>
            onFormChange({ ...form, logsSubscribe: updated })
          }
          addressError={addressError}
          onValidateAddress={onValidateAddress}
        />
      );
    case "signatureSubscribe":
      return (
        <SignatureSubscribeBuilder
          form={form.signatureSubscribe}
          onFormChange={(updated: SignatureSubscribeForm) =>
            onFormChange({ ...form, signatureSubscribe: updated })
          }
          addressError={addressError}
          onValidateAddress={onValidateAddress}
        />
      );
    case "slotSubscribe":
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No configuration needed. Subscribes to real-time slot updates.
        </div>
      );
    case "rootSubscribe":
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No configuration needed. Subscribes to real-time root slot updates.
        </div>
      );
    default:
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {activeMethod} builder coming soon.
        </div>
      );
  }
}
