# Backend — Claude Code Instructions

## PR-by-PR workflow

Work through [TODO.md](TODO.md) **one item at a time**:

1. Pick the next unchecked item.
2. Implement it on a new branch: `feat/backend-<slug>` (e.g. `feat/backend-ktor`).
3. Open a **small, focused PR** — one logical change per PR, no bundling.
4. **Stop and tell the user** the PR URL. Do not start the next item until they say the PR is merged.
5. After merge, pull `main`, mark the item done in `TODO.md`, and repeat.

Never skip ahead or bundle multiple TODO items into one PR.

## Stack

- **Framework**: Ktor (not Spring Boot)
- **Database**: PostgreSQL via Exposed ORM + HikariCP
- **Migrations**: Flyway
- **Auth**: JWT
- **LLM**: Anthropic Kotlin SDK with prompt caching enabled (see TODO items 7+)

## Environment variables

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | JDBC URL for Postgres |
| `DATABASE_USER` | DB username |
| `DATABASE_PASSWORD` | DB password |
| `JWT_SECRET` | Secret for signing JWTs |
| `ANTHROPIC_API_KEY` | Anthropic API key (items 7+) |

## Code style

- Idiomatic Kotlin — data classes, extension functions, sealed classes for results.
- No unnecessary abstractions. Prefer direct Exposed DSL over repository pattern until the codebase is large enough to warrant it.
- Keep route handlers thin; business logic in plain functions or service objects.
