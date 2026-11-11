# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OpenSpiir is an open-source, self-hostable personal finance app in the spirit of [Spiir](https://spiir.dk), which shut down on 2026-06-06. Features: transaction import, categorization, budgets and savings goals.

## Start here

- **[ROADMAP.md](ROADMAP.md)**: the work plan and the workflow for picking up items. Work on exactly one roadmap item per PR.
- **[docs/decisions.md](docs/decisions.md)**: the decision log. Read it before proposing anything that changes direction, and add an entry when a project-level decision is made.
- **[docs/agent-workflow.md](docs/agent-workflow.md)**: how to pick up an issue (`agent-ready` and `area:*` labels), the issue format, and testing requirements.
- Per-package instructions: [backend/CLAUDE.md](backend/CLAUDE.md).

## Key constraints

- **Self-hosting first.** It runs with `compose.yaml` under both Docker and Podman. Follow the Podman-compatibility rules in the decision log.
- **No open banking for now.** Data comes from manual entry and file import.
- **Multi-user data model.** Scope every row to a user, so a hosted version stays possible later.
- **Paused:** mobile app, hosted deployment and open banking. Their old code was removed from the repo; don't recreate it unless the roadmap says so.
- Money is stored as integer minor units plus a currency code, never as floats.

## Monorepo structure

```
backend/        # Kotlin + http4k + PostgreSQL, GraphQL API
web/            # Web client (not started)
docs/           # Decision log, guides
```

The packages are independent, each with its own build tooling. There's no workspace root tooling.

## Contribution context

AI-assisted contributions are welcome. Keep PRs small and reviewable. Prefer the simplest thing that works and is easy for new contributors to understand.
