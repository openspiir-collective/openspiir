# OpenSpiir

An open-source, self-hostable personal finance app in the spirit of [Spiir](https://spiir.dk), the Danish budgeting app that shut down on 2026-06-06.

The goals: import your transactions, categorize them, and track budgets and savings goals, all on a server you control.

## Status

Early development. See [ROADMAP.md](ROADMAP.md) for what's planned and what's done, and [docs/decisions.md](docs/decisions.md) for why things are the way they are.

## Contributing

Help is very welcome, and AI-assisted contributions are fine. Pick a GitHub issue labelled `agent-ready` and follow [docs/agent-workflow.md](docs/agent-workflow.md). Keep PRs small: one issue each, with tests. Reviews follow [docs/review-workflow.md](docs/review-workflow.md).

## Scope

- **In scope:** a self-hosted web app with a backend, run with Docker or Podman Compose.
- **Paused:** the mobile app, a hosted public service (and its cloud infrastructure), and automatic bank connections (open banking). Earlier code for the first two was removed and can be restored from git history; see [docs/decisions.md](docs/decisions.md).
- **Out of scope:** Spiir's "Assistant" and "Challenges" features.

## Repository layout

| Directory | Contents |
|---|---|
| `backend/` | Kotlin + http4k + PostgreSQL API (GraphQL) |
| `web/` | Web client (not started) |
| `docs/` | Decision log and guides |
