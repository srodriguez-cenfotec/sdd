# Feature Specification: To-Do List

**Feature Branch**: `001-todo-list`

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: Build a simple to-do list application named "Curso-PSWE-07" for
organizing and tracking daily tasks. Include a task list with All, Pending, and Done filters; a
task detail view for editing, completion changes, and confirmed deletion; persistent task storage;
and a clean, responsive visual design. Exclude accounts, categories, due dates, priorities, search,
and sync.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create, review, and filter tasks (Priority: P1)

As a person organizing daily work, I can add tasks and review the list by completion status so I
can quickly see what needs attention.

**Why this priority**: Creating and finding tasks is the core value of the application and provides
a useful experience on its own.

**Independent Test**: Add tasks with and without descriptions, view them in the list, switch among
all three filters, and reopen the application to verify the tasks remain available.

**Acceptance Scenarios**:

1. **Given** the task list is open, **When** the user adds a task with a title and optional
   description, **Then** the new task appears in the list with a Pending status.
2. **Given** the add-task form is open, **When** the user tries to save without a title,
   **Then** a validation message appears and the task is not saved.
3. **Given** the list contains pending and done tasks, **When** the user selects All, Pending, or
   Done, **Then** the list shows all tasks, only pending tasks, or only done tasks respectively,
   and the selected filter is highlighted.
4. **Given** the list contains no tasks or the selected filter has no matches, **When** the list
   is displayed, **Then** a short, friendly empty-state message is shown.
5. **Given** a task has been saved, **When** the user closes and reopens the application,
   **Then** the task and its saved details and completion status are still available.
6. **Given** saved tasks cannot be read when the application opens, **When** the task list is
   displayed, **Then** the application shows a clear storage error instead of presenting the list
   as empty.
7. **Given** saving a task change fails, **When** the user submits the change, **Then** the
   application shows a clear storage error and does not indicate that the change was saved.

---

### User Story 2 - Review and manage an individual task (Priority: P2)

As a person tracking a task, I can open its details, change its information or completion status,
and remove it when it is no longer needed.

**Why this priority**: Editing, completing, and deleting tasks keeps the task list useful over time,
after task information or status changes.

**Independent Test**: Open a task, verify its details, edit and cancel or save changes, change its
completion status in both directions, and delete it with and without confirming.

**Acceptance Scenarios**:

1. **Given** a task is shown in the list, **When** the user opens it, **Then** the detail view
   shows its title, description or muted "No description" text, current status, and a back control.
2. **Given** a task detail is open, **When** the user chooses Edit, **Then** the add-task form is
   reused with the current title and description and offers Save and Cancel.
3. **Given** a task is being edited, **When** the user saves a valid title, **Then** the updated
   task is shown; **When** the user cancels, **Then** unsaved changes are discarded.
4. **Given** a task is Pending, **When** the user chooses Mark as done, **Then** its status
   becomes Done and the available action changes to Mark as not done; **When** the user chooses
   that action, **Then** its status returns to Pending.
5. **Given** a task detail is open, **When** the user chooses Delete, **Then** a confirmation is
   requested before removal; **When** the user cancels confirmation, **Then** the task remains;
   **When** the user confirms, **Then** the task is removed.

### Edge Cases

- A title containing only whitespace is treated as empty and cannot be saved.
- A task with no description displays "No description" in its detail view.
- The empty state distinguishes an entirely empty task list from a filter with no matching tasks
  and offers a helpful message for either case.
- Cancelling task deletion or editing leaves the saved task unchanged.
- Long titles and descriptions remain readable on mobile and desktop layouts.
- A storage read or write failure is reported; a failed read is not treated as an empty task list,
  and a failed write is not reported as a successful save.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST be named "Curso-PSWE-07" in the To-Do List header and as the
  application or window title.
- **FR-002**: Each task MUST have a required title, an optional description, and a completion
  status of Done or Pending.
- **FR-003**: The To-Do List MUST let the user add a task through a clearly visible Add task
  control and a form with title and description fields.
- **FR-004**: A task MUST NOT be saved without a non-empty title; the form MUST show a validation
  message when the title is empty.
- **FR-005**: The task list MUST provide All, Pending, and Done filters, with the selected filter
  visibly highlighted and the list limited to matching tasks.
- **FR-006**: Each task row MUST show a status indicator and title. Done task titles MUST use
  strikethrough and muted color, and selecting a row MUST open that task's detail view.
- **FR-007**: The task list MUST show a short, friendly empty state when it contains no tasks or
  the active filter has no matching tasks.
- **FR-008**: The task detail view MUST provide a back control, prominent title, description
  beneath the title, and visible Done or Pending status. When no description is present, it MUST
  show muted "No description" text.
- **FR-009**: The user MUST be able to edit a task using the add-task form with its current values,
  Save, and Cancel controls. Saving MUST validate the title; cancelling MUST discard unsaved
  changes.
- **FR-010**: The task detail view MUST let the user change a task between Done and Pending. The
  action label MUST reflect the current status: Mark as done or Mark as not done.
- **FR-011**: Deletion MUST use a distinct warning color and require confirmation. Cancelling the
  confirmation MUST retain the task; confirming MUST remove it.
- **FR-012**: Saved tasks, including their descriptions and completion statuses, MUST remain
  available after the application is closed and reopened.
- **FR-013**: The design MUST use a light background, generous white space, one sans-serif font
  family, and a single accent color for primary actions and the active filter. Titles MUST be
  larger and bolder than descriptions, and text MUST have sufficient contrast.
- **FR-014**: The layout MUST adapt to mobile and desktop screen sizes. Interactive targets MUST
  be at least 44 by 44 pixels.
- **FR-015**: The application MUST NOT include accounts, categories, due dates, priorities,
  search, or synchronization.
- **FR-016**: If saved tasks cannot be read or a task change cannot be saved, the application MUST
  show a clear storage error. A read failure MUST NOT be presented as an empty task list, and a
  write failure MUST NOT be presented as a successful save.

### Key Entities

- **Task**: A user-created item with a required title, optional description, and Done or Pending
  completion status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a valid task and see it in the list in 100% of acceptance-test runs;
  attempts with a blank or whitespace-only title are rejected with a visible validation message.
- **SC-002**: In all three filter acceptance scenarios, the displayed tasks match the selected
  completion status and the active filter is visually identifiable.
- **SC-003**: In 100% of close-and-reopen acceptance-test runs, every previously saved task retains
  its title, description, and completion status.
- **SC-004**: Users can view, edit, complete, reopen, and delete a task according to each detail
  view acceptance scenario, including cancellation outcomes.
- **SC-005**: At mobile and desktop viewport sizes, the list and detail content remain usable
  without horizontal scrolling, and every interactive target is at least 44 by 44 pixels.
- **SC-006**: The application name, required task status treatments, empty states, and visual
  design rules in the functional requirements are present in their respective views.
- **SC-007**: In all storage-failure acceptance-test runs, read failures are visibly distinguished
  from an empty task list, and write failures are visibly reported without indicating that the
  change was saved.

## Assumptions

- The application is for one user on the same device and application environment; accounts and
  cross-device synchronization are excluded.
- Blank or whitespace-only titles are invalid. An omitted or empty description is allowed.
- The order of tasks in the list is not prescribed.
- Sufficient text contrast means at least 4.5:1 for normal text and 3:1 for large text.
