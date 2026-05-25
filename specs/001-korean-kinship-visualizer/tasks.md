---

description: "Task list for Korean Kinship Terminology Visualizer"
---

# Tasks: Korean Kinship Terminology Visualizer

**Input**: Design documents from `specs/001-korean-kinship-visualizer/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅,
contracts/ui-contracts.md ✅, quickstart.md ✅

**TDD note**: The constitution mandates TDD. Test tasks marked ⚠️ MUST be written
and verified to FAIL before the corresponding implementation tasks begin.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in all task descriptions

---

## Phase 1: Setup

**Purpose**: Initialize the project scaffolding and tooling. All tasks can begin
immediately; most are parallelizable.

- [x] T001 Initialize Vite + TypeScript + React project at repository root: create
  `package.json`, `tsconfig.json`, `vite.config.ts` with React plugin and path aliases
- [x] T002 [P] Install and configure Tailwind CSS: create `tailwind.config.ts` and
  `src/styles/globals.css` with design system tokens from research.md §5 as CSS
  custom properties
- [x] T003 [P] Configure Vitest for unit and contract tests: add `vitest.config.ts`
  referencing `tests/unit/` and `tests/contract/` directories
- [x] T004 [P] Configure Playwright for integration tests: create
  `playwright.config.ts` targeting `http://localhost:5173` with Chromium, Firefox,
  and Safari
- [x] T005 [P] Create `index.html` at repository root with Noto Sans KR Google Fonts
  preconnect headers and `<div id="root">` React mount point
- [x] T006 [P] Install all npm dependencies: React 18, React Flow 11+, TypeScript 5,
  Tailwind CSS, Vitest, React Testing Library, Playwright, and axe-core (a11y)

**Checkpoint**: `npm install` succeeds; `npm run dev`, `npm run test`, and
`npx playwright install` all run without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions, pure utility functions, and canonical data that
all user stories depend on. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: No user story implementation can begin until T007–T016 are complete.

- [x] T007 [P] Define `FamilyMember` interface and related types in
  `src/types/family-member.ts` (gender, generation, lineageSide, ageOrder, roleLabel
  per contracts/ui-contracts.md)
- [x] T008 [P] Define `KinshipTerm` interface and `speechRegister` type in
  `src/types/kinship-term.ts`
- [x] T009 [P] Define `RelationshipType` enum (28 values), `RelationshipKey` type,
  and `RelationshipMapping` type in `src/types/relationship.ts` (all values from
  contracts/ui-contracts.md)
- [x] T010 Write failing unit tests for `deriveRelationshipType()` in
  `tests/unit/term-lookup.test.ts` — one test per RelationshipType enum value; verify
  all tests FAIL before proceeding to T011 ⚠️ TDD RED
- [x] T011 Implement `deriveRelationshipType(speaker, target): RelationshipType` pure
  function in `src/utils/term-lookup.ts` until all T010 tests pass ⚠️ TDD GREEN
- [x] T012 Write failing `lookupTerm()` unit tests in `tests/unit/term-lookup.test.ts`
  — one parametric assertion per expected mapping entry (e.g., "male speaker calling
  OLDER_SISTER returns 누나"); verify FAIL before T015 ⚠️ TDD RED
- [x] T013 [P] Write failing contract tests for `KinshipTerm` field compliance in
  `tests/contract/kinship-data.test.ts` — assert every term has non-empty `hangul`,
  `romanization`, `englishGloss`, and literal `"존댓말"` register ⚠️ TDD RED
- [x] T014 Create canonical 24-node `FamilyMember` array in `src/data/family-tree.ts`
  — all nodes from research.md §8 with `id`, `gender`, `generation`, `lineageSide`,
  `ageOrder`, and `roleLabel` populated
- [x] T015 Implement `lookupTerm(speaker, target, mapping): KinshipTerm | "SELF"`
  pure function in `src/utils/term-lookup.ts` (returns `"SELF"` when
  `speaker.id === target.id`)
- [x] T016 Populate `RelationshipMapping` in `src/data/kinship-terms.ts` — all
  ~80–120 entries covering every `(speakerGender, RelationshipType)` combination,
  verified against 국립국어원 표준국어대사전 (address form/호칭); all T012 and T013
  tests MUST pass after this task ⚠️ TDD GREEN

**Checkpoint**: `npm run test:run` exits 0 (all unit and contract tests pass); all 28
RelationshipType values have at least two test assertions (male + female speaker where
applicable)

---

## Phase 3: User Story 1 — Select Speaker, View All Kinship Terms (Priority: P1) 🎯 MVP

**Goal**: Click any node in the tree and all other nodes immediately update to display
the Korean kinship terms that selected person uses for each relative. The selected node
shows "나 (Na)" as a self-indicator.

**Independent Test**: Select the ego node on load (default) — verify all other nodes
display the correct terms ego uses for them. Then select the paternal grandmother node
— verify all terms update to her perspective (e.g., ego node now shows what she calls
ego, which is 손자 for a male ego).

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST and verify they FAIL before T018**

- [ ] T017 Write failing Playwright integration test in
  `tests/integration/kinship-tree.test.ts` for speaker switching: (a) assert ego
  node is selected by default on load; (b) click paternal grandmother node; (c) assert
  ego node label changes to 손자 (sonson) for male ego; (d) assert paternal grandfather
  node label changes to 영감 or appropriate address form; (e) assert selected node
  displays "나 (Na)" ⚠️ TDD RED

### Implementation for User Story 1

- [x] T018 [P] [US1] Implement `FamilyNode` React component in
  `src/components/FamilyNode/FamilyNode.tsx`: accepts `member`, `term`, `isSelected`,
  `onSelect` props; renders Hangul term as primary label (16px) and romanization as
  secondary label (11px); when `isSelected` displays "나 (Na)" instead; applies
  selected border/background from design tokens; implements `role="button"`,
  `tabIndex={0}`, keyboard activation (Enter/Space calls `onSelect`), and
  `aria-label` with role + term + English gloss
- [x] T019 [P] [US1] Implement `KinshipTree` component skeleton in
  `src/components/KinshipTree/KinshipTree.tsx`: wraps React Flow `<ReactFlow>` with
  `FamilyNode` registered as a custom node type; accepts `nodes`, `edges`, and
  `onNodeClick` as props; enables pan and zoom controls; sets canvas background to
  `--color-surface`
- [x] T020 [US1] Implement `App` component in `src/App.tsx`: initialize
  `SpeakerPerspective` state to `{ memberId: "ego", gender: "male" }` using
  `useState`; implement `handleSpeakerSelect(memberId)` that updates perspective;
  compute the term for every node by calling `lookupTerm(speaker, target, mapping)`
  for each member; pass computed terms and `isSelected` flags as props to
  `KinshipTree`
- [x] T021 [US1] Wire `src/main.tsx` entry point: render `<App>` into `#root`, wrap
  with React Flow `<ReactFlowProvider>`, and apply Tailwind base styles via
  `src/styles/globals.css`

**Checkpoint**: `npm run dev` → open browser → ego node is highlighted, all other
nodes display correct Korean terms ego uses for them; clicking any node immediately
updates all labels; selected node shows "나 (Na)"; all T017 integration tests pass

---

## Phase 4: User Story 2 — Browse and Understand the Family Structure (Priority: P2)

**Goal**: Without any interaction, the family tree renders a structurally correct
extended family across four generations with visually distinct connection line types
and a structural role label on each node.

**Independent Test**: Load the application and without clicking anything, verify: all
24 nodes are visible with their structural role label, connection lines between parent
and child nodes are present, sibling lines differ visually from parent-child lines,
and the core three-generation view fits in a 1280×800 viewport.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST and verify they FAIL before T023**

- [ ] T022 Write failing Playwright test in `tests/integration/kinship-tree.test.ts`
  for initial render: (a) assert all 24 node `aria-label` values are present in the
  DOM without any click; (b) assert at least one parent-child edge is rendered; (c)
  take a viewport screenshot at 1280×800 and assert no horizontal scrollbar is present
  ⚠️ TDD RED

### Implementation for User Story 2

- [x] T023 [P] [US2] Add structural `roleLabel` display to `FamilyNode` component in
  `src/components/FamilyNode/FamilyNode.tsx`: render `member.roleLabel` in 10px
  secondary color (`--color-text-secondary`) above the Hangul term label
- [x] T024 [P] [US2] Define custom edge types in
  `src/components/KinshipTree/edges.ts`: parent-child edges (1.5px solid
  `--color-edge-default`), sibling edges (1.5px dotted `--color-edge-default`),
  marriage edges (1.5px dashed `--color-edge-marriage`); register all three in the
  React Flow `edgeTypes` map
- [x] T025 [US2] Define all 24 node positions and all edges in
  `src/components/KinshipTree/KinshipTree.tsx`: position nodes in four horizontal
  bands by generation (-2 at top, +1 at bottom); paternal subtree left-of-center,
  maternal subtree right-of-center; ego generation centered; all 24 nodes and their
  connecting edges fully defined; verify the generation -2 through 0 bands (core
  three generations) are visible at 1280×800 without horizontal scroll

**Checkpoint**: `npm run dev` → load application without clicking → all 24 nodes
visible with role labels and distinct connection lines; core three generations fit
1280×800; all T022 integration tests pass

---

## Phase 5: User Story 3 — Inspect a Kinship Term for Details (Priority: P3)

**Goal**: Hovering over or clicking any kinship term label opens a tooltip/panel
displaying the Hangul term, romanization, English gloss, and usage note (if present).
Dismissing it (Escape or click-outside) closes the panel cleanly.

**Independent Test**: Hover over the 외할아버지 label → verify a panel appears with
"외할아버지", "oeharabeoji", "maternal grandfather", and the panel closes on Escape.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST and verify they FAIL before T027**

- [ ] T026 Write failing Playwright test in `tests/integration/kinship-tree.test.ts`
  for term detail: (a) hover over any FamilyNode term label; (b) assert detail panel
  appears with `role="tooltip"` containing Hangul, romanization, and English gloss;
  (c) press Escape; (d) assert panel is no longer visible ⚠️ TDD RED

### Implementation for User Story 3

- [x] T027 [P] [US3] Implement `TermDetail` component in
  `src/components/TermDetail/TermDetail.tsx`: accepts `term: KinshipTerm`,
  `isVisible: boolean`, `anchorId: string`; renders Hangul (bold, 16px), romanization
  (11px), English gloss, and `usageNote` section (only when non-null); sets
  `role="tooltip"`; positioned relative to trigger node; dismisses on Escape key and
  click-outside (document `mousedown` listener)
- [x] T028 [US3] Wire `TermDetail` into `FamilyNode` in
  `src/components/FamilyNode/FamilyNode.tsx`: manage `isDetailVisible` local state;
  toggle on hover (`onMouseEnter`/`onMouseLeave`) and on click; render `<TermDetail>`
  passing the node's current `term` prop; add `aria-describedby` on the node element
  pointing to the tooltip `id`

**Checkpoint**: `npm run dev` → hover any term label → detail panel appears with all
required fields; Escape closes it; no visual residue after dismiss; all T026 tests pass

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility hardening, performance verification, code quality, and
final validation.

- [ ] T029 [P] Verify keyboard navigation: in `src/components/KinshipTree/KinshipTree.tsx`
  ensure React Flow's `tabIndex` propagation allows Tab to cycle through all 24 nodes;
  manually verify Enter/Space selects nodes and updates all labels; add
  `aria-pressed={isSelected}` to each `FamilyNode` wrapper
- [ ] T030 [P] Add WCAG 2.1 AA axe-core contract test in
  `tests/contract/accessibility.test.ts`: mount the full application in a test
  environment and assert zero axe violations at AA level; focus especially on color
  contrast and ARIA attribute completeness
- [ ] T031 [P] Verify production bundle size: run `npm run build`; assert gzipped
  bundle output in `dist/` is under 500KB; document the measured size in a comment
  in `vite.config.ts`
- [ ] T032 Run full `quickstart.md` validation checklist: verify each item manually
  using the running application; check off all items; update checklist with any
  discrepancies found
- [ ] T033 [P] Code cleanup: run linter (`npm run lint`) and fix all warnings across
  `src/`; remove any unused imports; verify TypeScript strict mode reports zero errors
  (`npm run typecheck`)
- [ ] T034 Run complete test suite in CI mode: `npm run test:ci`; confirm all unit,
  contract, and integration tests pass; confirm coverage report shows ≥80% branch
  coverage for new code in `src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — begin immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion — no US2/US3 dependency
- **US2 (Phase 4)**: Depends on Phase 2 completion — no US1/US3 dependency
- **US3 (Phase 5)**: Depends on Phase 2 + US1 completion (TermDetail wires into FamilyNode from US1)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Can start after Phase 2 — builds on top of KinshipTree component from US1
  (T019), but US2 tasks (T023–T025) are additive; US1 can complete independently
- **US3 (P3)**: Requires FamilyNode from US1 (T018) as the trigger surface;
  start US3 only after T018 is complete

### Within Each User Story

- ⚠️ TDD: test tasks MUST be written and FAIL before any implementation in that story
- T018 and T019 can run in parallel (different files)
- T020 depends on T018 and T019 being complete (wires them together)
- T023 and T024 can run in parallel
- T025 depends on T024 (uses edge types)
- T027 and T028 can start in parallel but T028 must complete after T027

### Parallel Opportunities

- All Phase 1 tasks marked [P] run in parallel after T001
- T007, T008, T009 run in parallel (different type files)
- T010 and T013 run in parallel after T009
- T018 and T019 run in parallel after Phase 2 complete
- T023 and T024 run in parallel after Phase 2 complete
- T029, T030, T031, T033 run in parallel in Phase 6

---

## Parallel Execution Examples

### Phase 2 — Foundational

```bash
# Run in parallel after project setup:
Task T007: Define FamilyMember types in src/types/family-member.ts
Task T008: Define KinshipTerm types in src/types/kinship-term.ts
Task T009: Define RelationshipType enum in src/types/relationship.ts

# After T009:
Task T010: Write deriveRelationshipType() tests (RED)
Task T013: Write contract tests for KinshipTerm (RED)

# After T010 passes:
Task T011: Implement deriveRelationshipType() (GREEN)
```

### Phase 3 — User Story 1

```bash
# After T017 test is written and failing (RED):
Task T018: Implement FamilyNode component
Task T019: Implement KinshipTree component

# After T018 + T019:
Task T020: Implement App component
Task T021: Wire main.tsx entry point
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Write T017 tests (RED), then complete Phase 3: US1
4. **STOP and VALIDATE**: Click every node; verify all labels update; check 나 indicator
5. US1 is a fully functional MVP — the core kinship learning mechanic works

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready
2. Phase 3 (US1) → Speaker-perspective switching works → **MVP complete**
3. Phase 4 (US2) → Tree structure visually complete with role labels and edge styles
4. Phase 5 (US3) → Term detail tooltips → full feature complete
5. Phase 6 → Production-ready (a11y, bundle size, clean code)

### Parallel Team Strategy

With two developers after Phase 2:

- **Developer A**: Phase 3 (US1) — core speaker mechanic
- **Developer B**: Phase 4 (US2) — tree structure and layout

Both are independent after Phase 2. Developer B should coordinate with Developer A on
the `FamilyNode` component (T018/T023 both touch `FamilyNode.tsx`).

---

## Notes

- [P] tasks use different files with no blocking dependencies — safe to parallelize
- [US1]/[US2]/[US3] labels map tasks to user stories for traceability
- TDD ⚠️ markers = tests MUST fail before implementation begins (constitution mandate)
- Each story checkpoint is independently demonstrable without running other stories
- Verify tests FAIL before implementing; commit after each task or logical group
- The RelationshipMapping in T016 is the most linguistically sensitive task — take
  extra time to cross-reference 국립국어원 for each entry
