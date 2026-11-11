# AGENTS.md

Instructions for coding agents working in this repository. (`CLAUDE.md` imports this file.)

## Project

OpenSpiir is an open-source, self-hostable personal finance app in the spirit of [Spiir](https://spiir.dk), which shut down on 2026-06-06. Features: transaction import, categorization, budgets and savings goals.

## Your role decides what you read

You have exactly one role in a session. Each role has its own instructions:

| Role | Instructions |
|---|---|
| **Implementer**: you pick up an issue and open a PR | [docs/agent-workflow.md](docs/agent-workflow.md) |
| **Reviewer**: you review someone else's PR | [docs/review-workflow.md](docs/review-workflow.md) |

If your task doesn't say which role you have, you're an implementer. Never review a PR you wrote, and never push code to a PR you're reviewing.

**Don't read or edit anything in `pm/`.** It's the maintainer's project-management workspace. Everything you need is in the issue, this file, the workflow docs and the code.

## Reference (read, don't edit)

- [ROADMAP.md](ROADMAP.md): the overall plan and where your issue fits. The maintainer keeps it up to date.
- [docs/decisions.md](docs/decisions.md): why things are the way they are. Read it before proposing anything that changes direction. If your work involves a project-level decision, describe it in your PR, and the maintainer records it.
- Per-package instructions: [backend/AGENTS.md](backend/AGENTS.md).

## Key constraints

- **Self-hosting first.** It runs with `compose.yaml` under both Docker and Podman. Follow the Podman-compatibility rules in `docs/decisions.md`.
- **No open banking for now.** Data comes from manual entry and file import.
- **Multi-user data model.** Scope every row to a user, so a hosted version stays possible later.
- **Paused:** the mobile app, hosted deployment and open banking. Don't recreate them.
- **Out of scope:** Spiir's "Assistant" and "Challenges" features.
- Money is stored as integer minor units plus a currency code, never as floats.
- Never commit real personal financial data. Test fixtures must be anonymized or made up.

## Monorepo structure

```
backend/   # Kotlin + http4k + PostgreSQL, GraphQL API
web/       # Web client (Vite + React + TypeScript + Tailwind; not started)
docs/      # Decision log, workflow docs, guides
```

The packages are independent, each with its own build tooling. There's no workspace root tooling.

## General

Prefer the simplest thing that works and is easy for new contributors to understand. Keep PRs small: one issue per PR.
