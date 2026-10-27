# User Interface Contract

This contract summarizes observable behavior for the two specified views. The feature
specification remains authoritative for full requirements.

## To-Do List

- Show "Curso-PSWE-07", an All / Pending / Done filter, and a clearly visible Add task action.
- Highlight the active filter. Each task row shows a status indicator and title; Done titles use
  strikethrough and muted color.
- Selecting a task row opens that task's detail view.
- The add form accepts a required title and optional description. Saving a blank or whitespace-only
  title shows a validation message and does not create a task.
- Show a friendly empty state for an empty list and for a filter with no matching tasks.

## To-Do Detail

- Provide a back control, prominent title, description or muted "No description", and visible Done
  or Pending status.
- Provide Edit, Mark as done / Mark as not done, and Delete actions. Delete uses a warning color and
  asks for confirmation before removing the task.
- Edit reuses the add form with existing values and Save / Cancel actions. Cancel discards unsaved
  edits.

## Shared Interaction and Presentation

- Use a light background, generous whitespace, one sans-serif font family, and one accent color
  for primary actions and the active filter. Ensure sufficient contrast.
- Adapt the layout for mobile and desktop. Every interactive target is at least 44 by 44 pixels.
- Persist successful task changes so they remain after closing and reopening the application at the
  same origin.
- On storage read failure, show a clear error instead of presenting an empty list. On storage write
  failure, show a clear error and do not claim that the change was saved.
- UI code communicates with task operations and does not access persistence directly.
