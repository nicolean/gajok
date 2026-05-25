# Pre-Planning Checklist: Korean Kinship Terminology Visualizer

**Purpose**: Lightweight author self-review to identify spec gaps before proceeding to
`/speckit-plan`. Covers both linguistic data completeness and UX/interaction
requirement quality. Items flag missing or underspecified requirements — not whether
the implementation works.
**Created**: 2026-05-24
**Feature**: [spec.md](../spec.md)
**Focus**: Balanced (Linguistic Accuracy + UX/Interaction) | Depth: Lightweight | Audience: Author

---

## Linguistic Data Completeness

- [ ] CHK001 - Are all speaker-attribute dimensions that determine term selection
  (gender, age relative to target, lineage side) enumerated as a complete set in the
  spec, or are additional factors (e.g., speaker marital status) left unaddressed?
  [Completeness, Spec §FR-004]

- [ ] CHK002 - Is the exact composition of the family tree (specific count and type
  of each node) fully enumerated, or are only minimum thresholds defined? A minimum
  of "at least one" leaves the authoritative tree ambiguous for implementation.
  [Gap, Spec §FR-001]

- [ ] CHK003 - Is the authoritative Korean linguistics reference named for SC-002
  term verification? "A standard Korean linguistics reference" is not actionable for
  the author to verify against during implementation. [Clarity, Spec §SC-002]

- [ ] CHK004 - Are all paternal/maternal term pairs where lineage affects the term
  enumerated (e.g., 할아버지/외할아버지, 삼촌/외삼촌, 고모/이모, 할머니/외할머니)?
  [Completeness, Spec §FR-010]

- [ ] CHK005 - Is the scope of in-law terms (mentioned only in Assumptions) promoted
  to a formal requirement specifying which in-law relationships are included in the
  tree? [Gap, Spec §Assumptions]

- [ ] CHK006 - Does the spec address whether any kinship term in the defined tree is
  affected by the speaker's marital status (e.g., how a married vs. unmarried person
  refers to certain relatives)? [Coverage, Gap]

---

## Relationship Mapping Specification

- [ ] CHK007 - Are the complete input dimensions of the RelationshipMapping entity
  (all factors that produce a unique term output) formally specified, not just listed
  informally in FR-004? [Completeness, Spec §Key Entities]

- [ ] CHK008 - Is it specified whether the RelationshipMapping covers one canonical
  term per speaker–target pair, or whether multiple acceptable term variants can exist
  for a single relationship? [Clarity, Gap]

- [ ] CHK009 - Does the spec clarify whether bidirectional relationships are
  explicitly mapped (i.e., if the mapping defines what A calls B, does it also require
  defining what B calls A, or is that derived automatically)? [Completeness, Gap]

- [ ] CHK010 - Is the behavior for a missing RelationshipMapping entry (no defined
  term for a speaker–target pair) specified as a formal requirement rather than only
  an edge case note? [Completeness, Spec §Edge Cases]

---

## Interaction & UX Requirements

- [ ] CHK011 - Is the default selected speaker on initial load specified as a
  formal requirement? The spec defines behavior after a speaker is selected but does
  not specify which node (if any) is active on first render. [Gap, Completeness]

- [ ] CHK012 - Is "visually distinguish" in FR-005 defined with measurable visual
  criteria (e.g., background color change, border style, size increase)? Without
  specifics, two implementers could produce inconsistent results. [Clarity, Spec §FR-005]

- [ ] CHK013 - Are the visual styles for each connection line type (parent–child,
  sibling, marriage) described with enough specificity for design implementation?
  [Clarity, Spec §FR-008]

- [ ] CHK014 - Is the trigger mechanism for the detail panel (hover vs. click vs.
  both) consistently specified? User Story 3 says "hovers over or clicks" while
  FR-011 says only "tooltip or detail panel" without specifying the trigger.
  [Consistency, Spec §FR-011, §US3]

- [ ] CHK015 - Is the "minimalist" design quality described in the original feature
  request defined with any measurable criteria in the spec, or is it left entirely
  to design discretion? [Gap, Clarity]

- [ ] CHK016 - Is it specified what the application displays during initial load
  before the family tree is fully ready (e.g., skeleton, spinner, blank)? [Gap, Coverage]

- [ ] CHK017 - Are accessibility requirements documented for the diagram? The project
  constitution mandates WCAG 2.1 AA but the spec contains no accessibility
  requirements for keyboard navigation, screen reader support, or color contrast.
  [Gap, Coverage]

---

## Acceptance Criteria Quality

- [ ] CHK018 - Is "standard broadband connection" in SC-005 quantified with a
  specific bandwidth figure so the criterion is objectively measurable?
  [Clarity, Spec §SC-005]

- [ ] CHK019 - Do FR-003 and SC-001 (both stating "within one second") create
  redundant acceptance criteria, and if so, is one definitively the gate? Duplication
  risks conflicting interpretations during review. [Consistency, Spec §FR-003, §SC-001]

- [ ] CHK020 - Can SC-003 ("within 30 seconds without external resources") be
  objectively measured without a formal user study? If not, should it be rephrased
  as a more directly testable criterion? [Measurability, Spec §SC-003]

- [ ] CHK021 - Is SC-002 (100% term accuracy) measurable without a named reference?
  Naming the specific source (e.g., 국립국어원 표준국어대사전) would make this
  criterion verifiable. [Clarity, Spec §SC-002]

---

## Edge Case & Scenario Coverage

- [ ] CHK022 - Is the "neutral placeholder" for undefined relationships (Edge Cases)
  specified as a formal requirement? Edge case notes are not requirements; FR-001–011
  do not capture this behavior. [Completeness, Spec §Edge Cases]

- [ ] CHK023 - Are requirements defined for diagram scroll or pan behavior when the
  full tree (including extended family) does not fit within the viewport on larger
  monitors or at different zoom levels? [Coverage, Gap]

- [ ] CHK024 - Is FR-002's reference to "tap" consistent with the Assumptions
  section excluding mobile support? If tap is intentional for touch-enabled desktops,
  this should be clarified. [Consistency, Spec §FR-002, §Assumptions]

---

## Assumptions & Dependencies

- [ ] CHK025 - Is the assumption that "all nodes have predefined genders" reflected
  as a formal functional requirement so it cannot be silently violated during
  implementation? [Traceability, Spec §Assumptions]

- [ ] CHK026 - Is the decision to use only polite speech (존댓말) documented with
  a rationale, or only stated? A reader unfamiliar with Korean speech levels needs
  to understand why other registers are excluded. [Clarity, Spec §Assumptions]

- [ ] CHK027 - Is the exclusion of mobile support captured as a formal out-of-scope
  statement in the Requirements section, or only as an assumption? Out-of-scope items
  in Assumptions can be overlooked during planning. [Traceability, Spec §Assumptions]

- [ ] CHK028 - Is the client-side-only constraint (no server-side components) formally
  captured as a requirement rather than only an assumption, given that it significantly
  constrains the architecture? [Traceability, Spec §Assumptions]

---

## Notes

- **28 items total** — lightweight scan prioritizing the most actionable gaps for the
  author to resolve before planning.
- **Highest-priority items to resolve before `/speckit-plan`**: CHK002 (tree
  composition), CHK003 (named reference), CHK011 (default speaker), CHK017
  (accessibility), CHK022 (placeholder as formal requirement).
- Items marked `[Gap]` indicate missing requirements; items marked `[Clarity]`
  indicate existing requirements that need sharpening.
- Resolve `[Traceability]` items (CHK025–CHK028) by moving key assumptions into
  the Requirements section as formal FR entries or explicit out-of-scope statements.
