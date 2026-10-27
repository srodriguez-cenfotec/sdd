# Quickstart: To-Do List Validation

This guide applies after the planned application and development scripts have been implemented.
Serve the static app from the same origin for each run; browser-local storage is origin-specific.

## Prerequisites

- Node.js 22 or later and npm
- Python 3 for the local static file server
- A current desktop browser; Playwright installs its test browser once

## Install and Validate

From the repository root:

```sh
npm install
npx playwright install chromium
npm run lint
npm test
npm run test:acceptance
```

Expected results:

- Lint completes without errors.
- Unit tests pass for task validation, lifecycle operations, and persistence-interface behavior.
- Browser acceptance tests pass for task creation/filtering/reload and task detail/edit/status/delete
  flows at desktop and mobile viewport sizes.
- Browser acceptance tests verify that storage read failures are not shown as an empty list and
  storage write failures are not shown as successful saves.

## Verification Record

Validated on 2026-10-26:

- `npm run lint` passed.
- `npm test` passed all 14 unit tests.
- `npm run test:acceptance` passed all 14 Chromium acceptance tests, including mobile and desktop
  viewport checks for the list and detail views.
- `npm start` served the app, `src/app.js`, and `src/styles.css` successfully with HTTP 200.

## Manual Smoke Test

Start the app from the repository root:

```sh
python3 -m http.server 4173 --directory src
```

Open `http://localhost:4173` in a browser and verify:

1. The browser tab title and list header say "Curso-PSWE-07".
2. Add a task with a title and description; verify it appears as Pending. Try saving a blank title
   and confirm a validation message appears.
3. Switch All, Pending, and Done filters; verify the active state and visible rows are correct.
4. Open the task, edit it, cancel one edit, and save another. Verify the expected values each time.
5. Mark it done and not done; verify status labels and list styling update.
6. Choose Delete, cancel the confirmation, and verify it remains. Confirm deletion and verify it is
   removed.
7. Add another task, reload the page, and verify its title, description, and status remain.
8. Repeat the main list and detail flows at a narrow mobile viewport; verify no horizontal
   scrolling and interactive targets of at least 44 by 44 pixels.

The concrete test script names and scenarios are specified in
[contracts/ui.md](./contracts/ui.md) and the [data model](./data-model.md).
