import { ProgramSubscribeForm, Commitment, Encoding, Filter } from "../../lib/types";
import ProgramIdInput from "./ProgramIdInput";
import SegmentedControl from "./SegmentedControl";
import FiltersBuilder from "./FiltersBuilder";

const COMMITMENT_OPTIONS = [
  { value: "confirmed", label: "confirmed" },
  { value: "finalized", label: "finalized" },
  { value: "processed", label: "processed" },
];

const ENCODING_OPTIONS = [
  { value: "base64", label: "base64" },
  { value: "base64+zstd", label: "base64+zstd" },
  { value: "jsonParsed", label: "jsonParsed" },
];

interface Props {
  form: ProgramSubscribeForm;
  onFormChange: (form: ProgramSubscribeForm) => void;
  programIdError?: string;
  filterErrors?: Record<number, string>;
  onValidateProgramId: () => void;
}

export default function ProgramSubscribeBuilder({
  form,
  onFormChange,
  programIdError,
  filterErrors,
  onValidateProgramId,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <ProgramIdInput
        value={form.programId}
        onChange={(programId) => onFormChange({ ...form, programId })}
        error={programIdError}
        onValidate={onValidateProgramId}
      />
      <div className="grid grid-cols-2 gap-4">
        <SegmentedControl
          label="Commitment"
          options={COMMITMENT_OPTIONS}
          value={form.commitment}
          onChange={(v) => onFormChange({ ...form, commitment: v as Commitment })}
        />
        <SegmentedControl
          label="Encoding"
          options={ENCODING_OPTIONS}
          value={form.encoding}
          onChange={(v) => onFormChange({ ...form, encoding: v as Encoding })}
        />
      </div>
      <FiltersBuilder
        filters={form.filters}
        onChange={(filters: Filter[]) => onFormChange({ ...form, filters })}
        errors={filterErrors}
      />
    </div>
  );
}
