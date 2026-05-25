# Implementation Plan: Korean Kinship Terminology Visualizer

**Branch**: `001-korean-kinship-visualizer` | **Date**: 2026-05-24
**Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-korean-kinship-visualizer/spec.md`

---

## Summary

An interactive, client-side-only web application that visualizes Korean kinship
terminology. A pre-defined 24-node extended family tree is rendered as a minimalist
diagram using React Flow. Any node is selectable as the "speaker"; selecting a node
dynamically updates all other nodes to display the correct Korean kinship term (in
Hangul + Romanization) that the selected speaker uses for each relative. Term
correctness accounts for speaker gender, relative gender, relative age, and
paternal/maternal lineage. The linguistic core is a static `RelationshipMapping`
lookup table (~80–120 entries) verified against 국립국어원 (National Institute of
Korean Language) authoritative references.

---

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**:
- React 18 — component model; speaker perspective as top-level `useState`
- React Flow 11+ — interactive node-edge diagram (SVG-based; built-in pan/zoom)
- Vite — build tooling and dev server (HMR for fast iteration)
- Tailwind CSS — utility-first design system (enforces design token consistency)
- Vitest + React Testing Library — unit and component tests
- Playwright — integration tests for interactive diagram behavior

**Storage**: N/A — client-side only; all kinship data as static TypeScript constants.
The only runtime mutable state is `SpeakerPerspective` (a single React `useState`).

**Testing**: Vitest (unit + contract), Playwright (integration/e2e)

**Target Platform**: Desktop web browsers — Chrome 120+, Firefox 121+, Safari 17+,
Edge 120+. Mobile is explicitly out of scope for v1.

**Project Type**: Frontend-only single-page application

**Performance Goals**:
- Term label re-render: < 100ms from click to DOM commit (SC-001 threshold is 1s;
  targeting 100ms for perceived instantaneity)
- Initial load: < 3s on 10 Mbps connection (SC-005)
- Diagram pan/zoom: 60fps smooth interaction

**Constraints**:
- Production bundle: < 500KB gzipped (client-side; no lazy loading needed for 24 nodes)
- 3-generation core view fits 1280×800 viewport without horizontal scroll (SC-004)
- WCAG 2.1 AA: all nodes keyboard-navigable; color contrast ≥ 4.5:1

**Scale/Scope**:
- 24 `FamilyMember` nodes (static, fixed at compile time)
- ~80–120 `RelationshipMapping` entries
- 1 mutable state variable (`SpeakerPerspective`)
- Single-page application; no routing needed

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### I. Code Quality ✅ PASS

- `lookupTerm` and `deriveRelationshipType` are pure functions with single
  responsibilities — each independently testable with no side effects.
- All identifiers (e.g., `RelationshipType`, `SpeakerPerspective`, `lookupTerm`) are
  descriptive; no abbreviations.
- TypeScript strict mode enforces exhaustive enum handling — missing relationship
  types are compile-time errors, not runtime failures.
- **Justified complexity**: The `RelationshipMapping` table has ~80–120 entries. This
  complexity cannot be reduced: it is an exact representation of the Korean language's
  kinship system. Attempting to algorithmically derive terms would introduce incorrect
  results for irregular cases.

### II. Testing Standards ✅ PASS (with mandatory TDD requirement)

- **TDD gate**: `tests/unit/term-lookup.test.ts` MUST be written and failing before
  any entry is added to `src/data/kinship-terms.ts`. Each test asserts a specific
  (speaker_gender, relationship_type) → expected Hangul term.
- Unit tests cover the entire RelationshipMapping (parametric: each mapping entry
  generates one assertion). Coverage requirement: 100% of mapping entries tested.
- Integration tests (Playwright): speaker selection updates all visible labels.
- Contract tests: `KinshipTerm` field completeness and format compliance.
- Test names follow the pattern: `"[speaker gender] calling [relationship type] 
  returns [expected Hangul]"` — readable without opening the implementation.

### III. User Experience Consistency ✅ PASS (with WCAG requirement enforced)

- Design system tokens defined in research.md §5 and enforced via Tailwind config.
- WCAG 2.1 AA: mandated by constitution. All interactive nodes have `role="button"`,
  `tabIndex`, `aria-label`, and `aria-pressed`. Color contrast verified in design
  tokens (19.1:1 for primary text, per research.md §6).
- Minimalist design definition resolved (research.md §5): no shadows, max 2 font
  weights, no decorative elements.
- User flows validated against spec.md acceptance scenarios before feature is complete.

### IV. Performance Requirements ✅ PASS

- Performance goals defined above: <100ms label re-render, <3s load, 60fps pan.
- The update path from click → label re-render is fully synchronous (see
  contracts/ui-contracts.md Performance Contract). No async operations in the
  critical path.
- Static lookup is O(1); no iteration or computation at interaction time.
- Profiling gate: if render time exceeds 100ms during development, profile before
  optimizing; no speculative optimization.

**No violations → Complexity Tracking table not required.**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-korean-kinship-visualizer/
├── plan.md              # This file
├── research.md          # Phase 0: tech decisions + canonical tree definition
├── data-model.md        # Phase 1: entity definitions + state model
├── quickstart.md        # Phase 1: setup, run, validate
├── contracts/
│   └── ui-contracts.md  # Phase 1: TypeScript interfaces + component contracts
└── tasks.md             # Phase 2: generated by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── KinshipTree/
│   │   ├── KinshipTree.tsx        # React Flow wrapper; owns edge definitions
│   │   └── KinshipTree.test.tsx   # Component integration tests
│   ├── FamilyNode/
│   │   ├── FamilyNode.tsx         # Custom React Flow node; displays Hangul + label
│   │   └── FamilyNode.test.tsx
│   └── TermDetail/
│       ├── TermDetail.tsx         # Tooltip/detail panel (hover or click trigger)
│       └── TermDetail.test.tsx
├── data/
│   ├── family-tree.ts             # Canonical FamilyMember[] (24 nodes)
│   └── kinship-terms.ts           # RelationshipMapping (~80-120 entries)
├── types/
│   ├── family-member.ts           # FamilyMember interface + lineageSide type
│   ├── kinship-term.ts            # KinshipTerm interface + speechRegister type
│   └── relationship.ts            # RelationshipType enum + RelationshipMapping type
└── utils/
    └── term-lookup.ts             # deriveRelationshipType() + lookupTerm()

tests/
├── unit/
│   └── term-lookup.test.ts        # Parametric: all mapping entries
├── integration/
│   └── kinship-tree.test.ts       # Playwright: speaker switching e2e
└── contract/
    └── kinship-data.test.ts       # KinshipTerm field format compliance

index.html                         # Loads Noto Sans KR; React root
vite.config.ts
tsconfig.json
tailwind.config.ts
playwright.config.ts
```

**Structure Decision**: Single-project frontend SPA. No backend directory; no
routing; no build-time code splitting needed for 24 nodes.
