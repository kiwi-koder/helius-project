import { FormState, ProgramSubscribeForm, SubscriptionMethod } from "../../lib/types";
import ProgramSubscribeBuilder from "./ProgramSubscribeBuilder";

interface Props {
  activeMethod: SubscriptionMethod;
  form: FormState;
  onFormChange: (form: FormState) => void;
  programIdError?: string;
  filterErrors?: Record<number, string>;
  onValidateProgramId: () => void;
}

export default function BuilderForm({
  activeMethod,
  form,
  onFormChange,
  programIdError,
  filterErrors,
  onValidateProgramId,
}: Props) {
  switch (activeMethod) {
    case "programSubscribe":
      return (
        <ProgramSubscribeBuilder
          form={form.programSubscribe}
          onFormChange={(updated: ProgramSubscribeForm) =>
            onFormChange({ ...form, programSubscribe: updated })
          }
          programIdError={programIdError}
          filterErrors={filterErrors}
          onValidateProgramId={onValidateProgramId}
        />
      );
    default:
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {activeMethod} builder coming soon.
        </div>
      );
  }
}
