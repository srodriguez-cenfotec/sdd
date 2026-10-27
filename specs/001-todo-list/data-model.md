# Data Model: To-Do List

## Task

Represents one item the user wants to track.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | Stable unique identifier | Yes | Internal identity used to select, update, and delete an individual task; titles need not be unique. |
| `title` | String | Yes | Must contain a non-whitespace character. No maximum length is specified. |
| `description` | String | No | May be empty or omitted. No maximum length is specified. |
| `status` | `pending` or `done` | Yes | New tasks start as `pending`; users can transition in either direction. |

## Lifecycle and Operations

- **Create**: Validate the title, assign an identifier, and set status to `pending`.
- **Update**: Change the title and/or description after validating the title; preserve status.
- **Complete / reopen**: Transition `pending` to `done` or `done` to `pending`.
- **Delete**: Remove only after the user confirms the action.
- **Persistence**: Store the task collection through the persistence interface. A load or save
  failure is surfaced to the user; it must not be reported as a successful operation.

## Relationships and Constraints

- Tasks have no relationships to other entities.
- No title uniqueness, ordering, due date, category, priority, account, or synchronization
  behavior is defined.
- Persisted data is local to the same browser origin and profile; it is not a backup or cross-device
  sync mechanism.
