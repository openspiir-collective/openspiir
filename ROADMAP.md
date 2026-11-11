# Roadmap

The work plan for OpenSpiir, split into PR-sized items. It is written so a coding agent (or a person) can pick up the next item without extra context. For the reasoning behind decisions, see [docs/decisions.md](docs/decisions.md).

## How to work through this roadmap

1. **Pick one item.** Take the first unchecked item in the earliest phase that isn't blocked. Items list their dependencies under *Needs*. Don't start items marked ⏸ (waiting on a decision).
2. **One item per PR.** Use a branch named `<type>/<area>-<slug>`, e.g. `feat/backend-hoplite` or `docs/selfhost-guide`. Don't bundle items, and keep unrelated refactors out.
3. **Tick the item in the same PR.** Change `- [ ]` to `- [x]` here, so merging the PR updates the roadmap.
4. **Record decisions.** If the work forces a project-level decision, add an entry to `docs/decisions.md` in the same PR.
5. **Stop after opening the PR.** Report the PR URL and wait for review before starting the next item.
6. Follow the per-package instructions (e.g. [`backend/CLAUDE.md`](backend/CLAUDE.md)) for stack and code style.

Status: `[ ]` open · `[x]` done · ⏸ blocked on a decision (see [Open decisions](#open-decisions)).

---

## Phase 1: Backend foundation

Goal: a backend that starts, connects to Postgres and serves an authenticated GraphQL endpoint.

- [x] **B1. http4k server**: minimal http4k + Jetty server with `GET /health`.
- [ ] **B2. Hoplite config**: an `AppConfig` data class loaded from environment variables (see the table in `backend/CLAUDE.md`). No raw `System.getenv()` calls. Bind to the port in `PORT` (default 8080). Needs B1.
- [ ] **B3. PostgreSQL**: a HikariCP datasource built from `AppConfig`, Flyway migrations on startup, and one smoke-test migration. `/health` reports DB connectivity. Needs B2.
- [ ] **B4. Container image**: a `Containerfile` for the backend (multi-stage Gradle build → JRE runtime image, runs as non-root). Follow the Podman rules in `docs/decisions.md`. Needs B1.
- [ ] **B5. Compose stack**: `compose.yaml` at the repo root with `backend` + `postgres` (fully qualified images, a named volume, healthchecks, config through a `.env` file with a committed `.env.example`). Document `docker compose up` and `podman compose up` in a new `docs/self-hosting.md`. Needs B3, B4.
- [ ] **B6. Core schema**: Flyway migrations and Kotlin data classes for `users`, `accounts`, `categories` and `transactions`. Every row except `users` has a `user_id`. Store amounts as integer minor units (øre) plus an ISO currency code, never as floats. Needs B3.
- [ ] **B7. Auth**: local user accounts (a password hash using argon2 or bcrypt) with a login route that issues a JWT. Protected routes verify the JWT. Signup can be turned off through config (`ALLOW_SIGNUP`), so a self-hoster can lock their instance after creating their own account. Needs B6.
- [ ] **B8. GraphQL plumbing**: a `/graphql` endpoint using graphql-java's programmatic builder, a `ping` query, and the authenticated user available to resolvers. Needs B7.

## Phase 2: Getting data in

Goal: a user can get their transaction history into the system. Open banking is deferred, so this is how data arrives (see decisions).

- [ ] **D1. Accounts API**: GraphQL queries and mutations to list, create, rename and delete accounts. Needs B8.
- [ ] **D2. Categories API + defaults**: GraphQL CRUD for categories (main category → subcategory, like Spiir), plus a seed of default categories that follow Spiir's list. Needs B8.
- [ ] **D3. Transactions API**: GraphQL `transactions` (filter by account, date range and category, with pagination), `transaction`, `createTransaction`, `updateTransaction` and `deleteTransaction`. Needs D1, D2.
- [ ] **D4. CSV import, core**: upload a CSV for an account and map its columns (date, text, amount, optional balance) to fields. Handle Danish number and date formats (`1.234,56`, `dd-mm-yyyy`). Deduplicate so re-importing an overlapping file doesn't create duplicates. Needs D3.
- [ ] **D5. CSV import, bank presets**: saved column mappings for the major Danish banks (Danske Bank, Nordea, Jyske Bank, Lunar, Nykredit, Sydbank, Arbejdernes Landsbank). Each preset should come with an anonymized sample file in the tests. Needs D4.
- [ ] ⏸ **D6. Spiir export import** (#5): import a Spiir data export, including Spiir's categories, mapped onto ours. *Blocked:* needs an anonymized sample of Spiir's export format.
- [ ] **D7. Import source interface**: refactor the importers behind a small `TransactionSource` interface, so a paid aggregator (e.g. Lunch Flow) can be added later as an optional plugin. Don't implement an aggregator. Needs D4.

## Phase 3: Making sense of the data

Goal: the core Spiir features.

- [ ] **F1. Categorization rules**: user-defined rules (e.g. "text contains NETTO → Groceries"), applied on import and on demand to uncategorized transactions. Needs D3.
- [ ] **F2. Overview queries**: GraphQL aggregates for spending per category per month, income vs. expenses, and balance over time. Needs D3.
- [ ] **F3. Budgets**: a monthly budget per category, plus budget-vs-actual queries. Needs F2.
- [ ] **F4. Savings goals**: a goal (target amount, optional date) linked to an account or tracked manually, with progress queries. Needs D3.
- [ ] **F5. Data export**: export all of a user's data as CSV/JSON, so users are never locked in the way they were with Spiir. Needs D3.

## Phase 4: Client

⏸ **Blocked on decision C (below).** Items get written once that is settled. Whatever the choice, the client must:
- talk to the backend only through GraphQL;
- let the user enter the server URL (because instances are self-hosted);
- replace the mock data in the existing app screens with real queries.

## Later / not now

- **Open banking** (#3): optional aggregator plugin through D7. Deferred; see decisions.
- **Encryption of user data** (#19): needs its own design discussion. Note that zero-knowledge encryption conflicts with server-side categorization rules and aggregates.
- **Hosted deployment** (#20): the Pulumi/AWS code in `infrastructure/` is paused.

---

## Open decisions

Record each resolved one in `docs/decisions.md`, then update this roadmap.

- **C. Which client first: web or mobile app?** The app (`app/`) already has mock UI for Overview, Assistant and Challenges. A web client is easier to ship inside the compose stack for self-hosters. Expo can also target the web (`expo start --web`), which might let one codebase cover both.
- **What are "Assistant" and "Challenges"?** The app has mock screens for both. Decide whether they're in scope, and what they mean without Spiir's backend.
- **Spiir export format** (D6): someone needs to provide an anonymized sample export.
