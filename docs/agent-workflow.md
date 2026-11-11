# Implementer workflow

How an implementing agent (or human) picks up an issue and delivers a PR. Reviewers follow [review-workflow.md](review-workflow.md) instead.

## Labels

| Label | Meaning |
|---|---|
| `agent-ready` | Fully specified, and every dependency is merged. Can be picked up now. |
| `in-progress` | Someone is working on it. Stays on until the PR is merged or closed. |
| `area:backend` | Code in `backend/` (Kotlin, migrations, GraphQL schema). |
| `area:web` | Code in `web/`. |
| `area:ml` | Code in `categorizer/` (the optional Python ML service). |
| `area:selfhost` | Containerfiles, `compose.yaml`, `.env.example`, `docs/self-hosting.md`, CI workflows. |
| `area:docs` | Documentation outside the self-hosting guide. |
| `needs-review` | (on PRs) Ready for a reviewer. |

Rules:
- Only pick issues labelled `agent-ready`.
- Every issue has exactly one `area:*` label. **Only one issue per area may be `in-progress` at a time**, so agents don't clash (e.g. over Flyway migration numbers or the router). If every `agent-ready` issue is in a busy area, stop and say so.

## Steps

1. **Pick:** an `agent-ready` issue whose area has nothing else `in-progress`. Prefer the lowest roadmap ID.
2. **Claim:** add `in-progress` to the issue.
3. **Branch:** `<type>/<area>-<slug>`, e.g. `feat/backend-hoplite`. `<type>` is a [Conventional Commits](https://www.conventionalcommits.org/) type.
4. **Implement** exactly what the issue asks, with tests (see below). Don't edit `ROADMAP.md`, `docs/decisions.md` or anything in `pm/`.
5. **Commit as you go:** small commits, each with a message that explains *why* as well as *what* (see below).
6. **Open a PR** using the PR template, with `Closes #<n>`. Add the `needs-review` label and enable auto-merge (merge commit, not squash, so your commit history stays intact). The PR merges by itself once a reviewer approves, CI is green and all review threads are resolved.
7. **Stop** and report the PR URL. Don't start another issue.

### Responding to review

When a reviewer requests changes on your PR, fix each point in new commits. Don't force-push over reviewed history. Reply to each review comment saying what you changed, or why you disagree. Don't resolve review threads yourself; the reviewer does that. Then add `needs-review` again.

## Record what you did as you go

The commit history and the PR are the permanent record of your work. Future agents and the maintainer read them to understand why the code looks the way it does.

**Commit messages:** Conventional Commits subject (`feat(backend): load config with Hoplite`). Add a body whenever the change isn't self-explanatory, covering why it was done this way, alternatives you rejected, and anything surprising you found.

**PR description** (the template has these sections):
- **Summary:** what changed, in a few lines.
- **Decisions:** choices you made that the issue didn't dictate, with the reasoning. Flag any that are project-level (new dependencies, schema conventions, changes to the API shape). The maintainer records those in `docs/decisions.md`.
- **Deviations:** anywhere you didn't follow the issue exactly, and why.
- **Testing:** what the tests cover, plus any manual checks you ran.
- **Follow-ups:** anything you noticed but left out of scope. Open separate issues for them, or list them here.

## Issue format

Issues follow this structure (template: `.github/ISSUE_TEMPLATE/agent-task.md`): **Roadmap** ID, **Depends on**, **Goal**, **Context**, **Requirements**, **Acceptance criteria**, **Tests**, **Out of scope**. If an issue is ambiguous or contradicts the code or the decisions, ask in an issue comment and stop, rather than guessing.

## Testing requirements

All new behaviour has tests, and all tests pass. Tests run in CI once it's set up.

- **Backend:** JUnit 5. Test http4k handlers in memory (call the `HttpHandler` directly, no running server). Code that touches the database is tested against a real PostgreSQL through Testcontainers. Don't mock the database. (On Podman, Testcontainers needs Podman's Docker-compatible socket; see `backend/AGENTS.md`.)
- **Web:** Vitest + React Testing Library. Mock GraphQL at the network boundary.
- **Categorizer (Python):** use the test framework that comes with the chosen ML stack. Test the HTTP API and the train/predict round trip on small made-up datasets. Don't assert exact model accuracy in unit tests; that's what the evaluation harness is for.
- **Importers / parsers:** table-driven tests over small, committed, anonymized or made-up sample files.
- **Compose / containers:** the PR describes a manual smoke check (`docker compose up` and/or `podman compose up` reaching a healthy state), until CI covers it.
