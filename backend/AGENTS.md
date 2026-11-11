# Backend — agent instructions

## Workflow

Backend work is tracked as GitHub issues labelled `area:backend`. Implementers follow [docs/agent-workflow.md](../docs/agent-workflow.md); reviewers follow [docs/review-workflow.md](../docs/review-workflow.md). The general rules are in the root [AGENTS.md](../AGENTS.md).

## Stack

- **HTTP server**: http4k (not Spring Boot, not Ktor)
- **Configuration**: Hoplite — typed config from env / HOCON, no raw `System.getenv()` calls
- **Connection pooling**: HikariCP
- **Migrations**: Flyway
- **Database access**: plain JDBC behind small repository classes (one per aggregate). No ORM, no jOOQ, no query-builder libraries.
- **API**: graphql-java with the programmatic builder API (no schema-first SDL files)
- **Auth**: server-side sessions. A random session ID is stored (hashed) in a `sessions` table and sent as an httpOnly, `SameSite=Lax` cookie. No JWT.
- **JDK**: 25 (current LTS). Gradle toolchain and container runtime image both on 25.

## Configuration

All settings go through a Hoplite `AppConfig` data class. Environment variables map to config keys via Hoplite's default env-var source.

| Env var | Purpose |
|---------|---------|
| `DATABASE_URL` | JDBC URL for Postgres |
| `DATABASE_USER` | DB username |
| `DATABASE_PASSWORD` | DB password |
| `PORT` | HTTP port (default 8080) |
| `ALLOW_SIGNUP` | Whether new users can sign up (default true) |

## Code style

- Idiomatic Kotlin — data classes, extension functions, sealed classes for results.
- Keep http4k route handlers thin; business logic in plain functions or service objects.
- GraphQL resolvers (DataFetchers) delegate immediately to a service layer — no DB or LLM calls inside the fetcher itself.

## Tests and Podman

Database tests use Testcontainers, which talks to the Docker API. On Podman, enable Podman's Docker-compatible socket (`systemctl --user enable --now podman.socket`) and point `DOCKER_HOST` at it. See the Testcontainers docs for details.
