# Agent workflow: issues, labels and PRs

How work is handed to coding agents (and humans). `ROADMAP.md` gives the overview and order. GitHub issues hold the spec for each item.

## Labels

| Label | Meaning |
|---|---|
| `agent-ready` | Fully specified, and every dependency is merged. Any agent can pick it up now. |
| `in-progress` | Someone is working on it. Add this when you start. |
| `area:backend` | Code in `backend/` (Kotlin, migrations, GraphQL schema). |
| `area:web` | Code in `web/`. |
| `area:selfhost` | Containerfiles, `compose.yaml`, `.env.example`, `docs/self-hosting.md`, CI workflows. |
| `area:docs` | `ROADMAP.md`, `docs/` (other than the self-hosting guide), readmes. |

Rules:
- Every issue has **exactly one** `area:*` label: the area whose files it mainly changes.
- **One agent per area at a time.** Before picking an issue, check that no open issue with the same `area:*` label is `in-progress`. This prevents merge conflicts, e.g. clashing Flyway migration numbers or both agents editing the router.
- Only pick issues labelled `agent-ready`. Issues without it are still being specified, or their dependencies aren't merged yet.

## Picking up an issue

1. Find an `agent-ready` issue whose area has nothing `in-progress`. Prefer the lowest roadmap ID.
2. Add `in-progress`.
3. Branch: `<type>/<area>-<slug>`, e.g. `feat/backend-hoplite`.
4. Implement exactly what the issue asks. If something is out of scope, open a new issue instead of bundling it in.
5. Open a PR with `Closes #<n>` in the description. In the same PR, tick the item in `ROADMAP.md`, and if a project-level decision was made, add an entry to `docs/decisions.md`.
6. Stop and report the PR URL.

## Issue format

Every `agent-ready` issue uses this structure (also available as the issue template `.github/ISSUE_TEMPLATE/agent-task.md`):

```markdown
**Roadmap:** <ID, e.g. B2>
**Depends on:** #<n>, … (or "nothing")

## Goal
One or two sentences: what this achieves and why.

## Context
Links to relevant decisions, files and earlier PRs. Only what's needed.

## Requirements
- Concrete things the implementation must do.

## Acceptance criteria
- [ ] Observable, checkable outcomes. A reviewer can verify each one.

## Tests
- Which tests must be added and what they must cover.

## Out of scope
- Things that look related but belong to other issues.
```

## Testing requirements

All PRs must include tests for new behaviour, and all existing tests must pass.

- **Backend:** JUnit 5. Test http4k handlers in memory (call the `HttpHandler` directly, no running server). Code that touches the database is tested against a real PostgreSQL through Testcontainers. Don't mock the database. Migrations are covered implicitly by tests that run Flyway.
- **Web:** Vitest + React Testing Library for components and logic. Mock the GraphQL layer at the network boundary.
- **Importers / parsers:** table-driven tests over small, committed, anonymized sample files. Never commit real personal financial data.
- **Compose / containers:** acceptance criteria describe a manual smoke check (`docker compose up` and `podman compose up` reach a healthy state), until CI covers it.

## Who does what

- **Maintainer + project-manager agent:** keep `ROADMAP.md` and `docs/decisions.md` up to date. Turn roadmap items into issues. Add `agent-ready` when an issue is fully specified and its dependencies are merged. Review and merge PRs.
  The project-manager to-do list and log live in [project-management.md](project-management.md).
- **Implementing agents:** follow this document and the per-package `CLAUDE.md`.
