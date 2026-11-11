# OpenSpiir

An open-source, self-hostable personal finance app in the spirit of [Spiir](https://spiir.dk), the Danish budgeting app that shut down on 2026-06-06.

The goals: import your transactions, categorize them, and track budgets and savings goals, all on a server you control.

## Status

Early development. See [ROADMAP.md](ROADMAP.md) for what's planned and what's done, and [docs/decisions.md](docs/decisions.md) for why things are the way they are.

## Contributing

Help is very welcome, and AI-assisted contributions are fine. Pick an unchecked item from the [roadmap](ROADMAP.md) and keep PRs small and focused, one roadmap item each.

## Repository layout

| Directory | Contents |
|---|---|
| `backend/` | Kotlin + http4k + PostgreSQL API (GraphQL) |
| `app/` | React Native + Expo mobile app |
| `web/` | Web client (not started) |
| `infrastructure/` | Pulumi/AWS code for a possible hosted version (paused) |
| `docs/` | Decision log and guides |
