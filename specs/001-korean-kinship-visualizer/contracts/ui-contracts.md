# UI Contracts: Korean Kinship Terminology Visualizer

**Branch**: `001-korean-kinship-visualizer` | **Date**: 2026-05-24

This document defines the interface contracts for the application's core data types
and component boundaries. Since the application is client-side only (no REST API),
contracts are expressed as TypeScript interface definitions and behavioral contracts
for component interactions.

---

## Data Contracts

### FamilyMember Interface

```typescript
interface FamilyMember {
  id: string;
  gender: "male" | "female";
  generation: -2 | -1 | 0 | 1;
  lineageSide: "paternal" | "maternal" | "ego" | "spouse";
  ageOrder: "older" | "younger" | "n/a";
  roleLabel: string;
}
```

**Contract rules**:
- `id` values MUST be unique across the `FamilyMember[]` array
- `ageOrder` MUST be `"n/a"` for all nodes where `generation !== 0`
- Every node in the canonical tree MUST be present; no node may be omitted

---

### KinshipTerm Interface

```typescript
interface KinshipTerm {
  hangul: string;
  romanization: string;
  englishGloss: string;
  usageNote: string | null;
  speechRegister: "존댓말";
}
```

**Contract rules**:
- `hangul` MUST match the address form (호칭) from 국립국어원 표준국어대사전
- `romanization` MUST follow 국립국어원 Revised Romanization exactly
- `englishGloss` MUST be present (non-empty string)
- `speechRegister` MUST always be the literal value `"존댓말"` in v1

---

### RelationshipType Enum

```typescript
enum RelationshipType {
  // Ascending
  PATERNAL_GRANDFATHER = "PATERNAL_GRANDFATHER",
  PATERNAL_GRANDMOTHER = "PATERNAL_GRANDMOTHER",
  MATERNAL_GRANDFATHER = "MATERNAL_GRANDFATHER",
  MATERNAL_GRANDMOTHER = "MATERNAL_GRANDMOTHER",
  FATHER = "FATHER",
  MOTHER = "MOTHER",
  PATERNAL_UNCLE = "PATERNAL_UNCLE",
  PATERNAL_AUNT = "PATERNAL_AUNT",
  MATERNAL_UNCLE = "MATERNAL_UNCLE",
  MATERNAL_AUNT = "MATERNAL_AUNT",

  // Lateral
  OLDER_BROTHER = "OLDER_BROTHER",
  OLDER_SISTER = "OLDER_SISTER",
  SELF = "SELF",
  SPOUSE = "SPOUSE",
  YOUNGER_BROTHER = "YOUNGER_BROTHER",
  YOUNGER_SISTER = "YOUNGER_SISTER",
  PATERNAL_COUSIN_MALE_OLDER = "PATERNAL_COUSIN_MALE_OLDER",
  PATERNAL_COUSIN_FEMALE_OLDER = "PATERNAL_COUSIN_FEMALE_OLDER",
  PATERNAL_COUSIN_MALE_YOUNGER = "PATERNAL_COUSIN_MALE_YOUNGER",
  PATERNAL_COUSIN_FEMALE_YOUNGER = "PATERNAL_COUSIN_FEMALE_YOUNGER",
  MATERNAL_COUSIN_MALE_OLDER = "MATERNAL_COUSIN_MALE_OLDER",
  MATERNAL_COUSIN_FEMALE_OLDER = "MATERNAL_COUSIN_FEMALE_OLDER",
  MATERNAL_COUSIN_MALE_YOUNGER = "MATERNAL_COUSIN_MALE_YOUNGER",
  MATERNAL_COUSIN_FEMALE_YOUNGER = "MATERNAL_COUSIN_FEMALE_YOUNGER",

  // Descending
  SON = "SON",
  DAUGHTER = "DAUGHTER",
  NEPHEW = "NEPHEW",
  NIECE = "NIECE",
}
```

**Contract rule**: The `deriveRelationshipType(speaker: FamilyMember, target:
FamilyMember): RelationshipType` function MUST be a pure function — same inputs always
produce the same output with no side effects.

---

### RelationshipMapping Type

```typescript
type RelationshipKey = `${FamilyMember["gender"]}:${RelationshipType}`;

type RelationshipMapping = Record<RelationshipKey, KinshipTerm>;
```

**Contract rules**:
- Every valid `(speaker_gender, RelationshipType)` combination MUST have an entry
- Entries MUST NOT be undefined at runtime for any node pair in the canonical tree
- The mapping MUST be defined as a static constant; it MUST NOT be mutated at runtime

---

### SpeakerPerspective Interface

```typescript
interface SpeakerPerspective {
  memberId: string;
  gender: "male" | "female";
}
```

**Contract rule**: `memberId` MUST reference a valid `FamilyMember.id` in the
canonical tree.

---

## Component Behavioral Contracts

### KinshipTree Component

**Input**: `familyMembers: FamilyMember[]`, `speakerPerspective: SpeakerPerspective`,
`onSpeakerSelect: (memberId: string) => void`

**Behavioral contract**:
- MUST render all 24 family member nodes
- MUST call `onSpeakerSelect` when any non-speaker node is clicked/activated
- MUST NOT call `onSpeakerSelect` when the currently selected speaker is clicked
- MUST re-render all node labels within one render cycle after `speakerPerspective`
  changes (no deferred/batched updates that would cause stale labels)

---

### FamilyNode Component

**Input**: `member: FamilyMember`, `term: KinshipTerm | "SELF"`, `isSelected: boolean`,
`onSelect: () => void`

**Behavioral contract**:
- When `isSelected` is `true`: MUST display `"나 (Na)"` regardless of `term`
- When `isSelected` is `false`: MUST display `term.hangul` as primary label and
  `term.romanization` as secondary label
- MUST expose `role="button"`, `tabIndex={0}`, and an `aria-label` reflecting
  the current term and role
- MUST apply selected visual styles (border color, background tint) when `isSelected`
- MUST NOT display any internal state; all state is passed via props

---

### TermDetail Component (Tooltip/Panel)

**Input**: `term: KinshipTerm`, `isVisible: boolean`, `anchorId: string`

**Behavioral contract**:
- MUST display all four fields: `hangul`, `romanization`, `englishGloss`, `usageNote`
  (omitting `usageNote` section if `null`)
- MUST have `role="tooltip"` and be linked to its trigger via `aria-describedby`
- MUST be dismissible via Escape key and by clicking outside the panel
- MUST NOT block interaction with other nodes while visible

---

## Term Lookup Contract

```typescript
function lookupTerm(
  speaker: FamilyMember,
  target: FamilyMember,
  mapping: RelationshipMapping
): KinshipTerm | "SELF"
```

**Contract**:
- Returns `"SELF"` when `speaker.id === target.id`
- Returns the correct `KinshipTerm` for all other valid (speaker, target) pairs
- MUST be a pure function (no side effects, no exceptions for valid inputs)
- MUST complete in O(1) time — no iteration over the full member list

---

## Performance Contract

All label updates triggered by a speaker selection MUST complete within the same
React render cycle. The update path is:

```
User click → onSpeakerSelect(memberId) → setState(newPerspective)
           → React re-render → all FamilyNode components receive new term prop
           → DOM update complete
```

No setTimeout, debounce, or asynchronous operation may be introduced into this path.
The entire update MUST be synchronous from state change to DOM commit.
