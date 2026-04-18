# Backend — Claude Code Instructions

## PR-by-PR workflow

Work through [TODO.md](TODO.md) **one item at a time**:

1. Pick the next unchecked item.
2. Implement it on a new branch: `feat/backend-<slug>` (e.g. `feat/backend-http4k`).
3. Open a **small, focused PR** — one logical change per PR, no bundling.
4. **Stop and tell the user** the PR URL. Do not start the next item until they say the PR is merged.
5. After merge, pull `main`, mark the item done in `TODO.md`, and repeat.

Never skip ahead or bundle multiple TODO items into one PR.

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
