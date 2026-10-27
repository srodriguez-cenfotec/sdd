---
description: "Implementation tasks for the To-Do List feature"
---

# Tasks: To-Do List

**Input**: Design documents from `specs/001-todo-list/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md

**Tests**: Required by the project constitution. Follow Red-Green-Refactor: write each unit or
acceptance test before the production code it requires, confirm it fails for the expected reason,
then implement the minimum code and refactor.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Tasks can run in parallel because they change different files and have no dependency on
  unfinished work in the same phase.
- **[Story]**: User-story label matching `spec.md`.
- Every task includes its target file path.

## Phase 1: Setup

**Purpose**: Establish the minimal JavaScript project and development validation tools.

- [X] T001 Create `package.json` with JavaScript module configuration, scripts for `start`, `lint`, `test`, and `test:acceptance`, and development dependencies for ESLint and Playwright.
- [X] T002 [P] Configure ESLint for the planned browser modules and tests in `eslint.config.js`.
- [X] T003 [P] Configure Playwright to run Chromium acceptance tests in `playwright.config.js`.

## Phase 2: Foundational

**Purpose**: Define and verify the shared persistence boundary required by both user stories.

- [X] T004 Write failing storage adapter tests for empty initial data, saving and loading task data, and propagating storage read/write failures in `tests/unit/task-storage.test.js`.
- [X] T005 Implement the small persistence interface and `localStorage` adapter in `src/task-storage.js`; keep browser storage access out of UI modules.

**Checkpoint**: The persistence adapter can be tested independently; user stories can proceed.

## Phase 3: User Story 1 - Create, review, and filter tasks (Priority: P1) - MVP

**Goal**: Create tasks, review and filter the list, show empty states, and retain saved tasks after
the application is reopened.

**Independent Test**: Add tasks with and without descriptions, reject a blank title, verify All,
Pending, and Done filters and empty states, then reload and verify the saved task values.

### Tests for User Story 1

- [X] T006 [P] [US1] Write failing unit tests for task creation, filtering, and title validation in `tests/unit/task-operations.test.js`. Verify `"Internal identity used to select, update, and delete an individual task; titles need not be unique."`, `"Must contain a non-whitespace character. No maximum length is specified."`, `"May be empty or omitted. No maximum length is specified."`, and `"New tasks start as pending; users can transition in either direction."`.
- [X] T007 [P] [US1] Write failing browser acceptance tests for add-task validation, list rendering, filters, empty states, persistence after reload, and mobile target sizing in `tests/acceptance/task-list.spec.js`; also verify a failed storage read shows an error instead of an empty list and a failed write shows an error without claiming the change was saved.

### Implementation for User Story 1

- [X] T008 [US1] Implement task creation, stable unique IDs, title validation, and status filtering in `src/task-operations.js`; enforce `"Internal identity used to select, update, and delete an individual task; titles need not be unique."`, `"Must contain a non-whitespace character. No maximum length is specified."`, `"May be empty or omitted. No maximum length is specified."`, and `"New tasks start as pending; users can transition in either direction."`.
- [X] T009 [US1] Create the semantic document structure, application/window title, list header, add-task form, filter controls, task list, and empty-state containers in `src/index.html`.
- [X] T010 [US1] Implement the light, responsive list and form presentation, single accent color, readable status styling, contrast, and 44-by-44-pixel minimum interactive targets in `src/styles.css`.
- [X] T011 [US1] Connect list rendering, add-task validation, filters, empty states, and persistence through task operations in `src/app.js`; do not access storage directly from UI code. Show a clear error on failed reads or writes, distinguish a failed read from an empty list, and do not indicate that a failed write was saved.

**Checkpoint**: User Story 1 passes its unit and browser acceptance tests independently.

## Phase 4: User Story 2 - Review and manage an individual task (Priority: P2)

**Goal**: Open task details, edit or cancel changes, toggle completion, and delete only after
confirmation.

**Independent Test**: With a task available, open details, verify its title, description and
status, save and cancel edits, toggle status in both directions, and test both cancelling and
confirming deletion.

**Dependency**: The detail flow opens a task from the list, so this phase follows User Story 1.

### Tests for User Story 2

- [X] T012 [P] [US2] Extend `tests/unit/task-operations.test.js` with failing tests for editing valid task values, rejecting invalid titles, preserving status during edits, toggling between `pending` and `done`, and deleting by stable task ID.
- [X] T013 [P] [US2] Write failing browser acceptance tests for detail navigation, "No description", edit/save/cancel, status-action labels, and confirmed or cancelled deletion in `tests/acceptance/task-detail.spec.js`.

### Implementation for User Story 2

- [X] T014 [US2] Implement task update, status-toggle, and delete operations in `src/task-operations.js`; preserve stable IDs and status on edits, and allow status transitions in both directions.
- [X] T015 [US2] Add the detail view, back control, status label, Edit, completion-toggle, Delete, and deletion-confirmation elements to `src/index.html`.
- [X] T016 [US2] Implement detail navigation, current-value editing, Save/Cancel handling, status updates, and confirmation-gated deletion in `src/app.js`, routing every task change through task operations and persistence.
- [X] T017 [US2] Style the detail and edit views, muted empty-description text, warning-color delete action, and mobile layout in `src/styles.css`.

**Checkpoint**: User Stories 1 and 2 pass their independent unit and browser acceptance tests.

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify the full feature against the specification and document runnable results.

- [X] T018 Run `npm run lint`, `npm test`, `npm run test:acceptance`, and the applicable mobile and desktop smoke scenarios; record commands and outcomes in `specs/001-todo-list/quickstart.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No source-code dependencies; complete project scripts before running tests.
- **Foundational (Phase 2)**: Depends on Setup; establishes the tested persistence boundary.
- **User Story 1 (Phase 3)**: Depends on the persistence boundary. Within this phase, write tests
  before their implementations; T006 and T007 can be written in parallel.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because users navigate from the list to a
  task's detail view. Its unit and browser tests (T012 and T013) can be written in parallel before
  the related implementation tasks.
- **Polish (Phase 5)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after the foundational persistence adapter; delivers the MVP.
- **User Story 2 (P2)**: Follows User Story 1 because the specified detail screen opens a selected
  task from the list.

### Parallel Opportunities

- After T001, T002 and T003 can run in parallel because they configure separate files.
- After T005, T006 and T007 can be authored in parallel because they cover separate unit and
  acceptance test files; both must fail for the expected missing behavior before implementation.
- After User Story 1 is complete, T012 and T013 can be authored in parallel.
- Within each story, parallelize only the explicitly marked tasks; tasks that touch the same
  production file remain sequential.

## Parallel Example: User Story 1

```text
Task: T006 Write unit tests in tests/unit/task-operations.test.js
Task: T007 Write acceptance tests in tests/acceptance/task-list.spec.js
```

## Parallel Example: User Story 2

```text
Task: T012 Extend unit tests in tests/unit/task-operations.test.js
Task: T013 Write acceptance tests in tests/acceptance/task-detail.spec.js
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational tasks.
2. Write and run the User Story 1 unit and acceptance tests; confirm the expected failures.
3. Implement the minimum task operations and list UI until User Story 1 passes.
4. Validate task creation, filtering, empty states, and persistence independently; stop for MVP
   review before starting the detail workflow.

### Incremental Delivery

1. Setup and persistence foundation.
2. User Story 1: create/review/filter tasks and verify persistence.
3. User Story 2: detail, edit, status toggle, and confirmed deletion.
4. Run all validation commands and smoke scenarios.
