# Quickstart: Korean Kinship Terminology Visualizer

**Branch**: `001-korean-kinship-visualizer` | **Date**: 2026-05-24

This guide covers how to set up, run, and validate the application locally.

---

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ (bundled with Node.js 20)
- A modern desktop browser (Chrome 120+, Firefox 121+, Safari 17+, or Edge 120+)

Verify:
```bash
node --version   # should print v20.x.x or higher
npm --version    # should print 10.x.x or higher
```

---

## Project Setup

```bash
# From the repository root
npm install
```

This installs all dependencies including React, React Flow, TypeScript, Vite,
Vitest, React Testing Library, and Playwright.

---

## Running in Development

```bash
npm run dev
```

Opens the application at `http://localhost:5173`. Hot module replacement (HMR)
is active — changes to TypeScript/TSX files reload the browser instantly.

On first load:
- The family tree renders with the ego node (나) selected by default
- All other nodes display the kinship terms the ego uses for each relative
- Click any node to switch the speaker perspective

---

## Building for Production

```bash
npm run build
```

Outputs a production bundle to `dist/`. The bundle must be under 500KB gzipped.
Verify with:

```bash
npm run build && npx vite-bundle-visualizer
```

Preview the production build locally:

```bash
npm run preview
```

---

## Running Tests

### Unit tests (term correctness + component logic)

```bash
npm run test
```

Runs Vitest in watch mode. The critical test suite is `tests/unit/term-lookup.test.ts`,
which verifies every entry in the RelationshipMapping against expected Korean terms.

To run once without watch:

```bash
npm run test:run
```

### Integration tests (interactive diagram behavior)

```bash
npm run test:integration
```

Runs Playwright tests that simulate speaker-selection interactions in a headless
browser and verify that all node labels update correctly.

### All tests (CI mode)

```bash
npm run test:ci
```

Runs unit + integration tests once; exits non-zero on any failure.

---

## Verifying Linguistic Correctness

The primary correctness gate is `tests/unit/term-lookup.test.ts`. Each entry in
the RelationshipMapping generates one parametric assertion. After any changes to
`src/data/kinship-terms.ts`, run the unit tests and verify:

1. All assertions pass
2. No RelationshipType enum value is missing a test case (TypeScript exhaustiveness
   checks in the test file will catch this at compile time)

Cross-reference suspicious terms against:
- 국립국어원 표준국어대사전: https://stdict.korean.go.kr
- 국립국어원 가족 호칭·지칭어 guidance

---

## File Structure

```
src/
├── components/
│   ├── KinshipTree/        # Main diagram wrapper (React Flow)
│   ├── FamilyNode/         # Individual node card component
│   └── TermDetail/         # Tooltip/detail panel component
├── data/
│   ├── family-tree.ts      # Canonical 24-node FamilyMember array
│   └── kinship-terms.ts    # RelationshipMapping data (the linguistic core)
├── types/
│   ├── family-member.ts    # FamilyMember + related types
│   ├── kinship-term.ts     # KinshipTerm interface
│   └── relationship.ts     # RelationshipType enum + RelationshipMapping type
└── utils/
    └── term-lookup.ts      # Pure deriveRelationshipType + lookupTerm functions

tests/
├── unit/
│   └── term-lookup.test.ts # Parametric tests for all ~80-120 mapping entries
├── integration/
│   └── kinship-tree.test.ts # Playwright: speaker switching, label updates
└── contract/
    └── kinship-data.test.ts # Validates all KinshipTerm fields are well-formed

specs/001-korean-kinship-visualizer/  # This feature's design docs
index.html                            # Entry point (loads Noto Sans KR)
vite.config.ts
tsconfig.json
```

---

## Validation Checklist (Before Marking Feature Complete)

- [ ] All unit tests pass (`npm run test:run`)
- [ ] All integration tests pass (`npm run test:integration`)
- [ ] Production bundle is under 500KB gzipped (`npm run build`)
- [ ] Core three-generation view fits 1280×800 without horizontal scroll
- [ ] Speaker selection updates all labels visually within 1 second
- [ ] Ego node is selected by default on first load
- [ ] Selected node displays "나 (Na)" self-indicator
- [ ] Tooltip shows Hangul + romanization + English gloss on hover/click
- [ ] Keyboard navigation: Tab cycles through nodes, Enter/Space selects
- [ ] Color contrast passes WCAG 2.1 AA (verify with browser DevTools or axe)
- [ ] All acceptance scenarios from spec.md verified against the running application
