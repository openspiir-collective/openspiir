# Backend — Claude Code Instructions

## Workflow

Backend work is tracked in the root [ROADMAP.md](../ROADMAP.md) (items `B*`, `D*`, `F*`). Follow the workflow described there: one item per PR, tick it in the same PR, then stop and report the PR URL.

## Stack

- **HTTP server**: http4k (not Spring Boot, not Ktor)
- **Configuration**: Hoplite — typed config from env / HOCON, no raw `System.getenv()` calls
- **Connection pooling**: HikariCP
- **Migrations**: Flyway
- **API**: graphql-java with the programmatic builder API (no schema-first SDL files)
- **Auth**: JWT

## Configuration

All settings go through a Hoplite `AppConfig` data class. Environment variables map to config keys via Hoplite's default env-var source.

| Env var | Purpose |
|---------|---------|
| `DATABASE_URL` | JDBC URL for Postgres |
| `DATABASE_USER` | DB username |
| `DATABASE_PASSWORD` | DB password |
| `JWT_SECRET` | Secret for signing JWTs |

## Code style

- Idiomatic Kotlin — data classes, extension functions, sealed classes for results.
- Keep http4k route handlers thin; business logic in plain functions or service objects.
- GraphQL resolvers (DataFetchers) delegate immediately to a service layer — no DB or LLM calls inside the fetcher itself.
