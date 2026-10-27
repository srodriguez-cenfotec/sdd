# Research: To-Do List

## Browser Application and Dependencies

**Decision**: Use semantic HTML, responsive CSS, and vanilla JavaScript modules for a static
browser application. Add no framework or runtime dependency.

**Rationale**: The repository has no application source or package manifest, and the feature is a
small single-user CRUD application with two views. A browser-native implementation meets the
specified interactions without introducing build setup or framework abstractions. The repository
README describes a specification workshop and notes that application implementation is not
required for the workshop; this plan is design guidance, not an instruction to implement now.

**Alternatives considered**:

- A UI framework: deferred because the specified two-view interaction does not require one.
- A server-backed application: rejected because accounts, synchronization, and shared access are
  explicitly out of scope.

## Persistence

**Decision**: Store the serialized task collection in `localStorage`, behind a small persistence
interface. Treat read, parse, and write failures as visible errors; do not show unsaved changes as
saved or silently replace unreadable data with an empty list.

**Rationale**: Browser storage is adequate for a small personal task list and meets the stated
close-and-reopen requirement on the same origin and browser profile. It is local, synchronous, and
stores strings, so it avoids introducing a server or a storage library. Browser policy can block
access and users can clear site data; this approach does not promise recovery or synchronization.
It also does not by itself make a cold-start offline app available.

**Alternatives considered**:

- `IndexedDB`: deferred until data size or query needs justify its additional asynchronous
  object-store machinery.
- A service worker: not included because offline first-launch behavior is not in the specification.
- Remote persistence: rejected because it adds network, service, and account/sync concerns outside
  the requested scope.

## Quality and Test Tooling

**Decision**: Use Node.js built-in `node:test` for independent unit tests, ESLint for linting, and
Playwright for browser acceptance tests covering both user stories.

**Rationale**: The constitution requires unit coverage for business logic, acceptance coverage for
each user story, and linting. Node's built-in runner covers application logic without an additional
test framework. ESLint and Playwright are limited to development dependencies; Playwright verifies
actual browser behavior and responsive layouts that unit tests cannot reliably validate.

**Alternatives considered**:

- Manual-only acceptance checks: rejected for repeatable coverage of the required interactive
  flows and responsive behavior.
- A third-party unit-test framework: rejected because Node provides the required runner.

## Sources

- Project README: `README.md` (workshop scope and no-implementation note).
- Feature requirements: `specs/001-todo-list/spec.md`.
- MDN, [`Window: localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- MDN, [Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- MDN, [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).
- MDN, [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
