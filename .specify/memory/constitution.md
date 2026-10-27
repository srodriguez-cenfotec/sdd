<!--
Sync Impact Report
Version change: unversioned template -> 1.0.0
Modified principles: template placeholders replaced by six requested principles
Added sections: Core Principles (six principles), Governance rules
Removed sections: unused template sections
Follow-up TODOs: none
-->
# Curso-PSWE-07 Constitution

## Core Principles

### I. Simplicity First (YAGNI)
Implement only what the spec requires. Choose the simplest solution that works. MUST NOT add
features, abstractions, configuration options, or dependencies "just in case". Any added
complexity MUST be justified in writing in the plan. This keeps the solution focused and
maintainable.

### II. Simple, Clear Design
Functions and modules MUST be small and have a single responsibility. Names MUST clearly reveal
intent. Avoid duplication only when it is real; MUST NOT build abstractions for a single use or
optimize prematurely. This keeps code understandable without adding needless structure.

### III. Structured Architecture
Code MUST separate into UI (screens and components), application logic (task operations), and
persistence (storage), with dependencies flowing UI -> logic -> persistence. UI code MUST NOT
access storage directly. Persistence MUST be hidden behind a small interface that can be replaced
or faked in tests. This separation keeps responsibilities clear and enables isolated testing.

### IV. Test-Driven Development (NON-NEGOTIABLE)
Development MUST follow Red-Green-Refactor: write a failing test first, make it pass with the
minimum code, then refactor. Production code MUST have a test that required it. Business logic
MUST have unit tests, and each user story MUST have at least one acceptance test mirroring its
acceptance scenarios. Tests MUST be fast and independent. This catches regressions while keeping
feedback reliable.

### V. Spec Is the Source of Truth
Every implementation task MUST trace to a requirement in the spec; anything not in the spec is out
of scope. Ambiguous requirements MUST be clarified before implementation. This prevents
unrequested behavior and costly rework.

### VI. Dependencies and Quality
Prefer the standard library and platform features. A third-party dependency MUST be added only
when it clearly removes more complexity than it adds. Code MUST pass linting and all tests before
it is considered done. This limits maintenance burden and ensures a verifiable quality bar.

## Governance

This constitution overrides other practices. Plans MUST include a "Constitution Check" that
verifies compliance before implementation begins, and reviews MUST verify compliance. Amendments
MUST include a written rationale and a version bump. Versioning follows semantic versioning:
MAJOR for backward-incompatible governance or principle changes, MINOR for added principles or
materially expanded guidance, and PATCH for clarifications and non-semantic refinements.

**Version**: 1.0.0 | **Ratified**: 2026-10-26 | **Last Amended**: 2026-10-26
