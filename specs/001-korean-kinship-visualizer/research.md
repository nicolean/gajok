# Research: Korean Kinship Terminology Visualizer

**Branch**: `001-korean-kinship-visualizer` | **Date**: 2026-05-24
**Phase**: Phase 0 — resolves all NEEDS CLARIFICATION items from Technical Context

---

## 1. Diagram Library

**Decision**: React Flow (v11+)

**Rationale**: React Flow is purpose-built for interactive node-edge graphs in React.
It provides built-in pan, zoom, fit-view, and minimap out of the box, renders via SVG
(enabling native ARIA attributes on nodes), and supports fully custom node components —
essential for rendering Hangul labels with Romanization inside each node card.
The family tree is a static, pre-defined graph with ~25 nodes and ~30 edges; React Flow
handles this trivially without performance concerns.

**Alternatives considered**:
- *D3.js*: Maximum flexibility but requires manual React integration, custom pan/zoom,
  and custom edge routing. Adds significant complexity for no functional gain here.
- *dagre-react*: Auto-layout is useful but the library is less maintained and lacks
  built-in interactivity primitives.
- *Pure SVG/Canvas*: Would require building pan, zoom, node interaction, and edge
  routing from scratch. Rejected on complexity grounds.

---

## 2. Kinship Data Architecture

**Decision**: Property-based relationship type lookup (not pairwise enumeration)

**Rationale**: A flat lookup table of every (speaker_id, target_id) → term pair would
require ~600 individual entries for a 25-node tree, making it unreadable and
unmaintainable. Instead:

1. Each `FamilyMember` node has four fixed attributes: `gender`, `generation`,
   `lineageSide`, and `ageOrder` (relative to ego).
2. A `RelationshipType` enum captures all distinct relationship classes in the tree
   (e.g., `PATERNAL_GRANDFATHER`, `MATERNAL_AUNT`, `OLDER_SISTER`).
3. Given any (speaker, target) pair, the relationship type is derived from the
   target's attributes *and* the speaker's position in the tree.
4. The `KinshipTermMap` is keyed by `(speaker_gender, relationship_type)` — roughly
   80–100 entries covering all linguistic combinations.

This keeps the data model maintainable and testable: each row in the term map
generates one parametric test assertion.

**Alternatives considered**:
- *Flat (speaker_id, target_id) pairwise map*: Correct but produces ~600 entries with
  massive duplication (e.g., every male speaker calls his paternal grandfather 할아버지,
  regardless of who he is). Rejected for unmaintainability.
- *Rule-based computation*: Fully algorithmic derivation of terms from relationship
  attributes. Attractive but Korean kinship rules have many irregular cases; a
  data-driven lookup is safer and more verifiable against the authoritative reference.

---

## 3. Authoritative Korean Linguistics Reference

**Decision**: 국립국어원 (National Institute of Korean Language) as primary authority

**Sources**:
- **Primary**: 국립국어원 표준국어대사전 (Standard Korean Language Dictionary,
  stdict.korean.go.kr) — authoritative definitions of all kinship terms
- **Secondary**: 국립국어원 "가족 간의 호칭·지칭어" (Family Address and Reference
  Terms) official guidance document — maps each family relationship to the correct
  term, distinguishing address (호칭) vs. reference (지칭) forms
- **Romanization**: 국립국어원 로마자 표기법 (Revised Romanization of Korean) —
  official romanization standard, applied to all terms in the application

**Note on address vs. reference forms**: Korean has distinct terms for directly
addressing a relative (호칭) vs. referring to them in conversation (지칭). For v1,
the application displays the address form (호칭) as the primary label, as this is more
useful for learners. The detail panel usage note flags cases where the two forms differ.

---

## 4. Korean Typography

**Decision**: Noto Sans KR via Google Fonts

**Rationale**: Noto Sans KR provides complete Korean glyph coverage, is freely
available as a web font, renders consistently across all target browsers, and has
appropriate character weight for minimalist design. Loading weights 400 (body) and
700 (bold) only, to minimize bundle size.

**Font loading strategy**: Loaded via `<link rel="preconnect">` + `<link
rel="stylesheet">` in the HTML head to ensure Korean glyphs are available before
first render, preventing unstyled text flash.

---

## 5. Minimalist Design System Tokens

**Decision**: Defined here to satisfy CHK015 (spec gap: "minimalist" undefined)

The following tokens constitute the design system for this application:

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F9FAFB` | Diagram canvas background |
| `--color-node-bg` | `#FFFFFF` | Node card background |
| `--color-node-border` | `#E5E7EB` | Node card default border |
| `--color-node-selected` | `#3B82F6` | Selected node border + accent |
| `--color-node-selected-bg` | `#EFF6FF` | Selected node background tint |
| `--color-text-primary` | `#111827` | Hangul terms, role labels |
| `--color-text-secondary` | `#6B7280` | Romanization, secondary labels |
| `--color-edge-default` | `#9CA3AF` | Connection lines |
| `--color-edge-marriage` | `#D1D5DB` | Marriage connection lines (dashed) |
| `--border-radius-node` | `8px` | Node card corner radius |
| `--border-width-node` | `1px` | Node card border |
| `--border-width-selected` | `2px` | Selected node border |
| `--font-family-korean` | `'Noto Sans KR', sans-serif` | All text |
| `--font-size-term` | `16px` | Primary Hangul term label |
| `--font-size-romanization` | `11px` | Romanization label |
| `--font-size-role` | `10px` | Structural role label |

**Minimalist constraints** (non-negotiable):
- Maximum 2 font weights in use at any time (400 + 700)
- No decorative icons, illustrations, or background patterns
- Connection lines are 1.5px; no arrowheads on parent-child lines
- No drop shadows on nodes (border only)

---

## 6. Accessibility Implementation

**Decision**: React Flow custom nodes with ARIA labels + keyboard navigation

**Rationale**: Constitution mandates WCAG 2.1 AA; spec CHK017 flagged this as a gap.

**Implementation decisions**:
- Each node renders as a `<div role="button" tabIndex={0}>` inside React Flow's custom
  node wrapper, enabling keyboard focus and selection via Enter/Space
- `aria-label` on each node = `"{role_label}: {speaker} calls them {hangul_term} ({english_gloss})"`
  — updates dynamically when speaker changes
- `aria-pressed` on selected node = `"true"`
- Color contrast: `--color-text-primary` (#111827) on `--color-node-bg` (#FFFFFF) =
  19.1:1 ratio (exceeds WCAG AA 4.5:1 minimum)
- Selected node: `--color-node-selected` (#3B82F6) border with `--color-node-selected-bg`
  (#EFF6FF) — focus indicator meets WCAG 2.1 SC 1.4.11 Non-text Contrast
- Tooltip/detail panel: `role="tooltip"`, linked to trigger via `aria-describedby`

---

## 7. Default Speaker on Initial Load

**Decision**: Ego node (central self node) is selected by default

**Rationale**: Addresses spec gap CHK011. The ego/self node is the natural starting
point for a kinship visualizer — the user immediately sees the world from the central
person's perspective, which is the most pedagogically useful starting state.

**Behavior**: On first render, the ego node is pre-selected, highlighted, and labeled
"나 (Na)". All other nodes display the terms that person calls them.

---

## 8. Canonical Family Tree Composition

**Decision**: 24 nodes across 4 generations

Addresses spec gap CHK002 (tree composition not fully enumerated). The canonical tree:

| ID | Role | Gender | Generation | Lineage |
|----|------|--------|------------|---------|
| patGrandpa | Paternal Grandfather | M | -2 | paternal |
| patGrandma | Paternal Grandmother | F | -2 | paternal |
| matGrandpa | Maternal Grandfather | M | -2 | maternal |
| matGrandma | Maternal Grandmother | F | -2 | maternal |
| father | Father | M | -1 | paternal |
| mother | Mother | F | -1 | maternal |
| patUncle | Paternal Uncle (father's older brother) | M | -1 | paternal |
| patAunt | Paternal Aunt (father's sister) | F | -1 | paternal |
| matUncle | Maternal Uncle (mother's brother) | M | -1 | maternal |
| matAunt | Maternal Aunt (mother's sister) | F | -1 | maternal |
| olderBro | Older Brother | M | 0 | ego |
| olderSis | Older Sister | F | 0 | ego |
| ego | Self (Ego) | M | 0 | ego |
| spouse | Spouse (Wife) | F | 0 | spouse |
| youngerBro | Younger Brother | M | 0 | ego |
| youngerSis | Younger Sister | F | 0 | ego |
| patCousinM | Paternal Male Cousin | M | 0 | paternal |
| patCousinF | Paternal Female Cousin | F | 0 | paternal |
| matCousinM | Maternal Male Cousin | M | 0 | maternal |
| matCousinF | Maternal Female Cousin | F | 0 | maternal |
| son | Son | M | +1 | ego |
| daughter | Daughter | F | +1 | ego |
| nephew | Nephew (older brother's son) | M | +1 | ego |
| niece | Niece (older sister's daughter) | F | +1 | ego |

**Note on ego gender**: The ego node is defined as male. This is necessary because
Korean kinship terms are asymmetric by speaker gender; a male ego and female ego would
produce different term sets for many relationships. The female perspective is accessible
by selecting any female node (spouse, older sister, younger sister, etc.).

---

## 9. Out-of-Scope Clarifications

**Address vs. reference forms**: v1 shows address form (호칭) only.
**Speech register**: Polite speech (존댓말) only; formal/informal toggling is v2.
**In-law terms for spouse**: Included where modern standard terms exist (e.g., spouse
can call ego's parents 아버님/어머님); excluded for distant in-laws without standard terms.
**Mobile layout**: Out of scope for v1.
