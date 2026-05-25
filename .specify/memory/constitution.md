<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: none (new document)
Added sections:
  - I. Code Quality
  - II. Testing Standards
  - III. User Experience Consistency
  - IV. Performance Requirements
  - Development Workflow
  - Quality Gates
  - Governance
Removed sections: none
Templates reviewed:
  - .specify/templates/plan-template.md ✅ — Constitution Check + Performance Goals/Constraints fields align with principles I and IV
  - .specify/templates/spec-template.md ✅ — User Scenarios, Success Criteria, and measurable outcomes align with principles II, III, and IV
  - .specify/templates/tasks-template.md ✅ — Test-first tasks, polish phase (perf/quality/security) align with principles I, II, and IV
  - .specify/templates/commands/ ✅ — directory not present; no updates required
  - README.md ✅ — not present; no updates required
Deferred items: none
-->

# Gajok Constitution

## Core Principles

### I. Code Quality

Every piece of code MUST be readable, maintainable, and free of unnecessary complexity.

- Functions and modules MUST have a single, clear responsibility.
- Identifiers MUST be descriptive; abbreviations are prohibited unless universally
  understood (e.g., `id`, `url`, `http`).
- Code MUST pass linting and static analysis with zero warnings before merge.
- Dependencies MUST be justified; unused imports and dead code MUST be removed.
- Complexity that cannot be eliminated MUST be documented with a concise rationale
  explaining *why* it must exist — not a description of what it does.

### II. Testing Standards

All production code MUST be covered by automated tests. Tests are written before or
alongside implementation; skipping this step is not acceptable.

- TDD MUST be followed: write tests first, verify they fail, then implement
  (Red–Green–Refactor).
- Each feature MUST include: unit tests for isolated logic, integration tests for
  component interactions, and contract tests for public API surfaces.
- Tests MUST be deterministic; flaky tests MUST be fixed or removed immediately —
  a flaky test is worse than no test.
- Minimum branch coverage for new code: 80%. Any reduction in project-wide coverage
  requires explicit sign-off and a plan to recover.
- Test names MUST describe the scenario and expected outcome; a reader MUST understand
  what the test verifies without opening the implementation.

### III. User Experience Consistency

Every user-facing interface MUST feel like a coherent product regardless of which
team member built it. Consistency is a quality gate, not a preference.

- All UI components MUST use the project design system; ad-hoc one-off styles are
  prohibited without design review approval.
- Error messages, labels, and copy MUST use consistent voice and terminology as
  defined in the project style guide.
- Interactive elements MUST meet WCAG 2.1 AA accessibility requirements.
- User flows MUST be validated against the acceptance scenarios in `spec.md` before
  a feature is marked complete.
- Breaking changes to shared UX patterns MUST go through design review before any
  implementation begins.

### IV. Performance Requirements

Performance is a feature. The system MUST meet defined targets under realistic load;
retrofitting performance after launch is not acceptable.

- Every feature plan MUST specify measurable performance goals (e.g., p95 latency,
  throughput, memory ceiling) before implementation begins.
- Performance regressions detected in CI MUST block merge.
- Critical paths MUST be profiled before optimization; speculative optimization without
  data is prohibited.
- The system MUST degrade gracefully under load: return meaningful errors rather than
  hang or silently drop work when resource limits are exceeded.

## Development Workflow

Feature work follows a spec-first, iterative process:

1. **Specify** — write `spec.md` capturing user stories and acceptance criteria.
2. **Plan** — produce `plan.md` with architecture decisions and a Constitution Check.
3. **Tasks** — generate `tasks.md` with dependency-ordered, independently testable tasks.
4. **Implement** — execute tasks; each task delivered as its own reviewable unit.
5. **Validate** — run the feature checklist; confirm all acceptance scenarios pass.

All four core principles MUST gate each phase transition. The Constitution Check in
`plan.md` documents compliance; any violation requires an explicit justification in
the Complexity Tracking table before work can proceed.

## Quality Gates

The following gates MUST pass before any feature branch is merged to `main`:

- [ ] All automated tests pass (unit, integration, contract).
- [ ] Static analysis and linting report zero warnings.
- [ ] Performance targets defined in `plan.md` are met or formally re-scoped with
      sign-off.
- [ ] UX acceptance scenarios from `spec.md` are verified against the running system.
- [ ] Code review approved by at least one other team member.
- [ ] Constitution Check in `plan.md` is complete with no unresolved violations.

## Governance

This constitution supersedes all other documented practices. Any practice that
conflicts with these principles MUST be updated or removed.

**Amendment procedure**:

1. Propose the change with a written rationale and impact assessment.
2. Obtain approval from at least one other maintainer.
3. Update this file, increment the version, and propagate changes to affected templates.
4. Record the change in the Sync Impact Report prepended to the amended file.

**Versioning policy**: MAJOR for backward-incompatible principle removals or
redefinitions; MINOR for new principles or material expansions of existing ones;
PATCH for clarifications and wording fixes that do not change intent.

**Compliance**: All PRs MUST verify compliance with this constitution. Reviewers are
responsible for flagging violations before approving. Quarterly retrospectives MUST
include a review of whether the principles remain fit for purpose and propose
amendments where needed.

**Version**: 1.0.0 | **Ratified**: 2026-05-24 | **Last Amended**: 2026-05-24
