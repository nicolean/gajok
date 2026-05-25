# Feature Specification: Korean Kinship Terminology Visualizer

**Feature Branch**: `001-korean-kinship-visualizer`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Build an application to visualize kinship terminology in Korean. Kinship terms are rendered in a minimalist and interactive family-tree-like diagram to show each person and the correct kinship term within an extended family tree. Since kinship terms in Korean are based on the person speaking, each box representing a person is selectable and the rest of the terms in the tree will render what the selected person should call that person."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Speaker, View All Kinship Terms (Priority: P1)

A learner of Korean selects any person in the family tree as the "speaker" and
immediately sees the Korean kinship terms that person uses to refer to every other
family member in the diagram. Selecting the paternal grandmother causes all nodes to
display the term she would use for each relative; selecting a younger daughter causes
all nodes to display the terms she would use from her perspective.

**Why this priority**: This is the core mechanic of the application. Speaker-relative
terminology is the defining characteristic of Korean kinship, and the perspective-
switching is what differentiates this tool from a static reference chart.

**Independent Test**: Can be fully tested by selecting any node and verifying that
every other node in the diagram updates its kinship term label to the correct Korean
term from that speaker's perspective, with no stale labels remaining.

**Acceptance Scenarios**:

1. **Given** the family tree is loaded with a default active speaker, **When** the
   user clicks any other person's node, **Then** every other node updates its kinship
   term label within one second to reflect what the newly selected speaker calls them.
2. **Given** a female family member is selected as speaker, **When** viewing sibling
   nodes, **Then** terms reflect female-speaker forms (언니 for older sister, 오빠
   for older brother, 남동생/여동생 for younger siblings).
3. **Given** a male family member is selected as speaker, **When** viewing sibling
   nodes, **Then** terms reflect male-speaker forms (누나 for older sister, 형 for
   older brother, 남동생/여동생 for younger siblings).
4. **Given** any node is selected as speaker, **When** the user views the selected
   node itself, **Then** it is visually highlighted and labeled with a self-indicator
   (나) so the active perspective is always unambiguous.
5. **Given** the paternal grandfather is selected, **When** viewing maternal-side
   relative nodes, **Then** terms correctly reflect his perspective on cross-lineage
   relationships.

---

### User Story 2 - Browse and Understand the Family Structure (Priority: P2)

A user navigates the extended family tree diagram to understand how Korean families
are structured—seeing generational layers, lineage sides (paternal and maternal), and
connection lines—before or without selecting any particular speaker perspective.

**Why this priority**: Users must orient themselves within the tree before
perspective-switching is meaningful. A clear initial layout reduces cognitive load
and makes the speaker-selection mechanic intuitive.

**Independent Test**: Can be tested independently by loading the application and
verifying that the tree renders a structurally correct extended family across at least
three generations, with visible connection lines and role labels, without any
user interaction.

**Acceptance Scenarios**:

1. **Given** the application loads, **When** no interaction has occurred, **Then**
   the family tree displays at minimum: both sets of grandparents, both parents,
   the ego/self node, at least one older and one younger sibling of each gender,
   a spouse, children, and at least one aunt/uncle with a cousin on each lineage side.
2. **Given** the diagram is displayed, **When** viewed on a 1280×800 desktop screen,
   **Then** the three-generation core view fits within the viewport without horizontal
   scrolling.
3. **Given** the diagram is displayed, **When** the user examines any node, **Then**
   each node clearly shows both the person's structural role (e.g., "Paternal
   Grandfather") and the current kinship term label from the active speaker's
   perspective.
4. **Given** the diagram is displayed, **When** the user looks at the connection
   lines, **Then** parent–child, sibling, and marriage relationships are visually
   distinguishable from one another.

---

### User Story 3 - Inspect a Kinship Term for Details (Priority: P3)

A user hovers over or clicks on a kinship term label to see supplemental information:
romanization, English gloss, and a brief usage note where the term requires contextual
clarification (e.g., terms used only in direct address vs. in reference).

**Why this priority**: Adds educational depth for language learners but does not
affect the core perspective-switching mechanic; the application delivers full core
value without it.

**Independent Test**: Can be tested independently by hovering or clicking any kinship
term label and confirming a tooltip or panel appears with Hangul, romanization, and
English gloss, then dismissing it cleanly.

**Acceptance Scenarios**:

1. **Given** a speaker is selected and terms are visible, **When** the user hovers
   over or clicks any kinship term label, **Then** a tooltip or detail panel appears
   showing: the Hangul term, its Revised Romanization, its English gloss, and any
   applicable usage note.
2. **Given** a detail view is open, **When** the user moves focus away or clicks
   elsewhere, **Then** the detail view closes and the diagram returns to its normal
   state with no residual overlay.
3. **Given** a term has a notable variant (e.g., addressing directly vs. referring
   to in conversation), **When** the detail view is open, **Then** the usage note
   explains the distinction plainly in English.

---

### Edge Cases

- What if a node has no defined Korean kinship term from the selected speaker's
  perspective (e.g., a very distant relative outside the defined tree scope)? →
  The node displays a neutral placeholder rather than a blank or an error.
- What if two nodes share the same kinship term from the selected speaker's
  perspective? → Each node independently displays its own correct term; duplication
  is linguistically correct and expected behavior.
- What if the user clicks the already-selected speaker node? → The selection remains
  unchanged; no visual or functional change occurs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an interactive family tree diagram spanning at
  minimum three generations: both sets of grandparents, both parents, the ego/self
  node, siblings (at least one older and one younger of each gender), a spouse,
  children, and at least one aunt/uncle with a cousin on each lineage side.
- **FR-002**: System MUST allow any node in the tree to be selected as the active
  speaker perspective with a single click or tap.
- **FR-003**: System MUST update all kinship term labels across the entire diagram
  within one second of a new speaker node being selected.
- **FR-004**: System MUST display the correct Korean kinship term in Hangul for each
  relationship, accounting for: speaker gender, relative gender, relative age
  (older/younger than speaker), and paternal vs. maternal lineage where Korean
  distinguishes them.
- **FR-005**: System MUST visually distinguish the currently selected speaker node
  from all other nodes.
- **FR-006**: System MUST label the selected speaker node with a self-indicator
  (나 / Na) so the active perspective is always visible.
- **FR-007**: System MUST display kinship terms in Hangul as the primary label, with
  Revised Romanization of Korean as a secondary label.
- **FR-008**: System MUST render relationship connection lines between nodes,
  visually distinguishing parent–child, sibling, and marriage relationships.
- **FR-009**: System MUST include distinct nodes for each gender-differentiated
  family role so all gender-dependent Korean terms are representable (e.g., separate
  nodes for paternal grandfather/grandmother, maternal uncle/aunt, older brother/
  older sister).
- **FR-010**: System MUST correctly distinguish paternal-side from maternal-side
  relatives and apply the appropriate Korean terms where lineage affects the term
  (e.g., 할아버지 vs. 외할아버지, 삼촌 vs. 외삼촌, 고모 vs. 이모).
- **FR-011**: System MUST display a tooltip or detail panel for any kinship term
  label containing: Hangul, romanization, English gloss, and optional usage note.

### Key Entities

- **FamilyMember**: A node in the tree defined by gender, generation level, lineage
  side (paternal/maternal/self), and age order relative to the ego node. These
  attributes are fixed and pre-defined; they determine which terms apply.
- **KinshipTerm**: A term object containing Hangul text, Revised Romanization,
  English gloss, and an optional usage note. Each term maps to a specific
  speaker–target relationship combination.
- **RelationshipMapping**: A lookup that, given a speaker FamilyMember and a target
  FamilyMember, returns the correct KinshipTerm. This is the authoritative source
  of linguistic correctness in the application.
- **SpeakerPerspective**: The currently active speaker node that drives all
  RelationshipMapping lookups and label rendering across the tree.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All kinship term labels update within one second of a user selecting a
  new speaker node, measured from click to full diagram re-render.
- **SC-002**: 100% of Korean kinship terms displayed for the pre-defined family tree
  are verified correct against a standard Korean linguistics reference, covering all
  speaker–target combinations in the tree.
- **SC-003**: A first-time user with no prior Korean knowledge can identify the
  correct Korean term for any displayed relationship within 30 seconds of selecting
  a speaker, without consulting external resources.
- **SC-004**: The three-generation core family tree renders fully within the viewport
  on a 1280×800 desktop screen without requiring horizontal scrolling.
- **SC-005**: The application loads and displays the complete, interactive family
  tree within three seconds on a standard broadband connection.

## Assumptions

- The family tree represents a pre-defined, canonical extended Korean family; user-
  defined or editable trees are out of scope for v1.
- All family member nodes have predefined genders, making all gender-dependent term
  lookups fully deterministic without additional user input.
- Korean terms reflect modern standard Korean (표준어); archaic, highly regional, or
  North Korean variants are out of scope.
- A single consistent speech register is used throughout: standard polite speech
  (존댓말); toggling formality levels is out of scope for v1.
- The primary target platform is desktop web browsers; mobile layout optimization is
  out of scope for v1.
- Romanization follows the Revised Romanization of Korean
  (국립국어원 로마자 표기법).
- In-law terms (terms a person uses for their spouse's relatives) are included in
  scope where Korean has well-established modern standard terms.
- The application is client-side only; no user accounts, data persistence, or
  server-side components are required.
