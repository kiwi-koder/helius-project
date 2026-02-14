export const COMMITMENT_OPTIONS = [
  { value: "confirmed", label: "confirmed" },
  { value: "finalized", label: "finalized" },
  { value: "processed", label: "processed" },
];

export const COMMITMENT_TOOLTIP = `confirmed - Supermajority has voted; good balance of speed and safety.
processed - Node has processed the block; fastest, may revert.
finalized - Block finalized; most certain.`;
