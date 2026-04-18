# Backend TODO

Work through these tasks one PR at a time. Each PR should be small, focused, and independently reviewable.

## Foundation

- [ ] **1. Add http4k** — replace the Gradle `application` scaffold with a minimal http4k server (single `GET /health` route, no database yet)
- [ ] **2. Add PostgreSQL** — add Exposed ORM + HikariCP, wire a datasource from env vars, run migrations with Flyway
- [ ] **3. Data models** — define DB tables and Kotlin data classes: `users`, `accounts`, `transactions`, `categories`
- [ ] **4. Auth** — JWT-based authentication (issue token on POST /auth/token, verify on protected routes)
- [ ] **5. Transactions API** — CRUD endpoints: list, get, create, update, delete transactions (no categorization yet)
- [ ] **6. Categories API** — manage categories (seeded defaults matching Spiir's category list)

## LLM Integration

- [ ] **7. Anthropic SDK** — add the Anthropic Kotlin SDK, wire `ANTHROPIC_API_KEY` from env, add a thin `LlmClient` wrapper with prompt caching enabled
- [ ] **8. Transaction categorization** — on transaction create/update, call the LLM to suggest a category; store the suggestion and a `categorized_by` field (`user` | `llm`)
- [ ] **9. Budget insights** — `GET /insights` endpoint: summarize spending patterns for the current month using the LLM, return structured JSON
- [ ] **10. Natural language search** — `POST /transactions/search` accepts a natural language query, translates it to a DB filter via LLM, returns matching transactions

## Polish

- [ ] **11. OpenAPI spec** — auto-generate from Ktor routes, serve at `/openapi.json`
- [ ] **12. Docker** — `Dockerfile` + `docker-compose.yml` with the app + Postgres + a local migrations step
