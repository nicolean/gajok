# Data Model: Korean Kinship Terminology Visualizer

**Branch**: `001-korean-kinship-visualizer` | **Date**: 2026-05-24
**Input**: spec.md entities + research.md decisions

---

## Entities

### FamilyMember

Represents a single node in the canonical family tree. All attributes are
fixed at definition time; they drive kinship term lookups deterministically.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique stable identifier (e.g., `"ego"`, `"patGrandpa"`) |
| `gender` | `"male" \| "female"` | Fixed gender; determines speaker-dependent terms |
| `generation` | `number` | Generational offset from ego: -2 (grandparent), -1 (parent), 0 (ego), +1 (child) |
| `lineageSide` | `"paternal" \| "maternal" \| "ego" \| "spouse"` | Which branch of the family this person belongs to |
| `ageOrder` | `"older" \| "younger" \| "n/a"` | Age relative to ego; used for sibling and cousin terms |
| `roleLabel` | `string` | Structural English role label (e.g., `"Paternal Grandfather"`) |

**Validation rules**:
- `id` MUST be unique across the entire tree
- `gender` MUST be defined for every node; no nullable gender
- `ageOrder` MUST be `"n/a"` for nodes not in generation 0
- `lineageSide` of `"spouse"` applies only to the ego's spouse node

**Canonical nodes**: 24 members as defined in research.md §8.

---

### KinshipTerm

Represents a single Korean kinship term with its full metadata. Stored as the
output value of the RelationshipMapping lookup.

| Field | Type | Description |
|-------|------|-------------|
| `hangul` | `string` | Korean term in Hangul script (e.g., `"할아버지"`) |
| `romanization` | `string` | Revised Romanization of Korean (e.g., `"harabeoji"`) |
| `englishGloss` | `string` | English meaning (e.g., `"paternal grandfather"`) |
| `usageNote` | `string \| null` | Optional clarification (e.g., address vs. reference form differences) |
| `speechRegister` | `"존댓말"` | Speech register; always polite for v1 |

**Validation rules**:
- `hangul` MUST be a non-empty Hangul-script string
- `romanization` MUST follow 국립국어원 Revised Romanization
- `englishGloss` MUST be present on every term
- `usageNote` is nullable; present only when address and reference forms differ
  or when a term has notable usage constraints
- `speechRegister` is a constant `"존댓말"` in v1; reserved for future extension

---

### RelationshipType

An enumeration of all distinct relationship classes in the canonical 24-node tree.
This is the bridge between tree structure and term lookup.

```
Ascending relationships (target is older than speaker):
  PATERNAL_GRANDFATHER         — father's father
  PATERNAL_GRANDMOTHER         — father's mother
  MATERNAL_GRANDFATHER         — mother's father
  MATERNAL_GRANDMOTHER         — mother's mother
  FATHER                       — direct father
  MOTHER                       — direct mother
  PATERNAL_UNCLE               — father's older brother
  PATERNAL_AUNT                — father's sister
  MATERNAL_UNCLE               — mother's brother
  MATERNAL_AUNT                — mother's sister

Lateral relationships (same generation as speaker):
  OLDER_BROTHER                — older male sibling of ego
  OLDER_SISTER                 — older female sibling of ego
  SELF                         — the speaker themselves (→ 나)
  SPOUSE                       — ego's wife/husband
  YOUNGER_BROTHER              — younger male sibling
  YOUNGER_SISTER               — younger female sibling
  PATERNAL_COUSIN_MALE_OLDER   — paternal uncle/aunt's older male child
  PATERNAL_COUSIN_FEMALE_OLDER — paternal uncle/aunt's older female child
  PATERNAL_COUSIN_MALE_YOUNGER
  PATERNAL_COUSIN_FEMALE_YOUNGER
  MATERNAL_COUSIN_MALE_OLDER
  MATERNAL_COUSIN_FEMALE_OLDER
  MATERNAL_COUSIN_MALE_YOUNGER
  MATERNAL_COUSIN_FEMALE_YOUNGER

Descending relationships (target is younger than speaker):
  SON                          — speaker's male child
  DAUGHTER                     — speaker's female child
  NEPHEW                       — sibling's male child
  NIECE                        — sibling's female child
```

**Derivation rules**: Given a (speaker, target) pair, `RelationshipType` is derived
from the combination of:
1. Target's `lineageSide`
2. Target's `generation` relative to speaker
3. Target's `gender`
4. Target's `ageOrder` (for generation 0 relatives)

The derivation function is a pure function with no side effects: same inputs always
produce the same `RelationshipType`.

---

### RelationshipMapping

The authoritative lookup table mapping (speaker gender × relationship type) to a
Korean kinship term. This is the core linguistic data of the application.

**Key**: `(speakerGender: "male" | "female", relationshipType: RelationshipType)`

**Value**: `KinshipTerm`

**Size**: approximately 80–120 entries, covering all unique combinations. Many
relationship types produce the same term regardless of speaker gender (e.g., FATHER →
아버지 for both male and female speakers); gender-dependent entries are those for
sibling terms and certain cousin terms.

**Critical gender-dependent entries** (illustrative, not exhaustive):

| Relationship Type | Male Speaker | Female Speaker |
|---|---|---|
| OLDER_BROTHER | 형 (hyeong) | 오빠 (oppa) |
| OLDER_SISTER | 누나 (nuna) | 언니 (eonni) |
| SPOUSE | 아내 / 와이프 (wife) | 남편 (nampyeon) |
| PATERNAL_COUSIN_MALE_OLDER | 형 (hyeong) | 오빠 (oppa) |
| PATERNAL_COUSIN_FEMALE_OLDER | 누나 (nuna) | 언니 (eonni) |

**Gender-neutral entries** (same term regardless of speaker gender, illustrative):

| Relationship Type | Term |
|---|---|
| PATERNAL_GRANDFATHER | 할아버지 (harabeoji) |
| PATERNAL_GRANDMOTHER | 할머니 (halmeoni) |
| MATERNAL_GRANDFATHER | 외할아버지 (oeharabeoji) |
| MATERNAL_GRANDMOTHER | 외할머니 (oehalmeoni) |
| FATHER | 아버지 (abeoji) |
| MOTHER | 어머니 (eomeoni) |
| PATERNAL_UNCLE | 큰아버지 (keun-abeoji) |
| PATERNAL_AUNT | 고모 (gomo) |
| MATERNAL_UNCLE | 외삼촌 (oe-samchon) |
| MATERNAL_AUNT | 이모 (imo) |
| SON | 아들 (adeul) |
| DAUGHTER | 딸 (ttal) |

**Authority**: All terms verified against 국립국어원 표준국어대사전 and the
official 가족 호칭·지칭어 guidance. Address forms (호칭) are used as the primary term.

---

### SpeakerPerspective

Represents the currently active speaker node. Drives all `RelationshipMapping`
lookups that populate the visible kinship term labels.

| Field | Type | Description |
|-------|------|-------------|
| `memberId` | `string` | ID of the selected `FamilyMember` node |
| `gender` | `"male" \| "female"` | Copied from selected member for lookup efficiency |

**Initial state**: `{ memberId: "ego", gender: "male" }` — the ego node is selected
on application load (see research.md §7).

**State transitions**: Any node click produces a new `SpeakerPerspective`. The
previous perspective is discarded (no history); no undo needed for v1.

---

## Entity Relationships

```
FamilyMember (24 nodes, static)
  │
  ├── is connected to other FamilyMembers via edges (static graph)
  │
  └── when selected, becomes SpeakerPerspective
        │
        └── drives RelationshipMapping lookups
              │
              RelationshipMapping[(speaker.gender, RelationshipType)] → KinshipTerm
                                                              ↑
              RelationshipType is derived from (speaker, target) FamilyMember attributes
```

---

## State Transitions

```
App start
  → SpeakerPerspective = ego (default)
  → All non-ego nodes: display term via RelationshipMapping[("male", type)]
  → Ego node: display "나 (Na)"

User clicks node X (where X ≠ current speaker)
  → SpeakerPerspective = X
  → All non-X nodes: re-compute via RelationshipMapping[(X.gender, type)]
  → X node: display "나 (Na)"
  → Previous speaker node: display its term from X's perspective

User clicks current speaker node X
  → No state change (idempotent)
```

---

## Data Storage

All entities are static compile-time constants. No runtime database, API calls,
or local storage is used.

- `FamilyMember[]` — TypeScript array exported from `src/data/family-tree.ts`
- `RelationshipMapping` — TypeScript Map/record exported from `src/data/kinship-terms.ts`
- `SpeakerPerspective` — React state (`useState`) in the root application component

The only mutable state at runtime is `SpeakerPerspective`.
