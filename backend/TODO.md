# Backend TODO

Work through these tasks one PR at a time. Each PR should be small, focused, and independently reviewable.

## Foundation

- [ ] **1. Add http4k** — replace the Gradle `application` scaffold with a minimal http4k server (single `GET /health` route, no database yet)
- [ ] **2. Add Hoplite** — typed configuration loaded from env / HOCON; define a `AppConfig` data class covering all runtime settings
- [ ] **3. Add PostgreSQL** — HikariCP datasource wired from Hoplite config, Flyway migrations on startup, a smoke-test migration
- [ ] **4. Data models** — define DB tables and Kotlin data classes: `users`, `accounts`, `transactions`, `categories`
- [ ] **5. Auth** — JWT-based authentication (issue token on a dedicated http4k route, verify on protected routes)
- [ ] **6. graphql-java setup** — wire a `/graphql` endpoint into http4k using graphql-java's programmatic builder API; empty schema + a `ping` query to verify the plumbing
- [ ] **7. Transactions** — GraphQL queries (`transactions`, `transaction`) and mutations (`createTransaction`, `updateTransaction`, `deleteTransaction`)
- [ ] **8. Categories** — GraphQL queries and mutations for categories; seed default categories matching Spiir's list

## Polish

- [ ] **9. Docker** — `Dockerfile` + `docker-compose.yml` with app + Postgres + local migrations step
