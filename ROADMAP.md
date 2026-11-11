# Roadmap

The work plan for OpenSpiir, split into PR-sized items. It is written so a coding agent (or a person) can pick up the next item without extra context. For the reasoning behind decisions, see [docs/decisions.md](docs/decisions.md).

## How to work through this roadmap

Each item gets its own GitHub issue, which holds the full spec. **Agents work from issues labelled `agent-ready`**, following [docs/agent-workflow.md](docs/agent-workflow.md), not from this file directly.

This file is maintained by the maintainer: items are ticked after their PR is merged. Implementing agents read it for context but don't edit it.

Status: `[ ]` open · `[x]` done · ⏸ blocked on a decision (see [Open decisions](#open-decisions)).

---

## Phase 1: Backend foundation

Goal: a backend that starts, connects to Postgres and serves an authenticated GraphQL endpoint. Backend stack: see `backend/AGENTS.md`.

- [x] **B1. http4k server**: minimal http4k + Jetty server with `GET /health`.
- [ ] **B9. Java 25**: bump the Gradle toolchain from 21 to 25 (current LTS). Needs B1.
- [ ] **CI1. Backend CI**: a GitHub Actions workflow that runs the backend tests (`./gradlew test`) on every PR and on pushes to `main`. Needs B1.
- [ ] **B2. Hoplite config**: an `AppConfig` data class loaded from environment variables (see the table in `backend/AGENTS.md`). No raw `System.getenv()` calls. Bind to the port in `PORT` (default 8080). Needs B1.
- [ ] **B3. PostgreSQL**: a HikariCP datasource built from `AppConfig`, Flyway migrations on startup, and one smoke-test migration. `/health` reports DB connectivity. Needs B2.
- [ ] **B4. Container image**: a `Containerfile` for the backend (multi-stage Gradle build → Java 25 JRE runtime image, runs as non-root). Follow the Podman rules in `docs/decisions.md`. Needs B9.
- [ ] **B5. Compose stack**: `compose.yaml` at the repo root with `backend` + `postgres` (fully qualified images, a named volume, healthchecks, config through a `.env` file with a committed `.env.example`). Document `docker compose up` and `podman compose up` in a new `docs/self-hosting.md`. Needs B3, B4.
- [ ] **B6. Core schema**: Flyway migrations and Kotlin data classes for `users`, `accounts`, `categories` and `transactions`. Each category has a `kind`: `income`, `expense` or `transfer` (whether a line is income or spending comes from its category, not the sign of the amount). Transactions carry the raw bank text and a nullable category. One category per transaction; splitting is out of scope for now. Every row except `users` has a `user_id`. Store amounts as integer minor units (øre) plus an ISO currency code, never as floats. Needs B3.
- [ ] **B7. Auth**: local user accounts (a password hash using argon2 or bcrypt), with login and logout routes. Server-side sessions: a `sessions` table holding hashed random session IDs, sent as an httpOnly `SameSite=Lax` cookie. No JWT. Protected routes check the session. Signup can be turned off through config (`ALLOW_SIGNUP`), so a self-hoster can lock their instance after creating their own account. Needs B6.
- [ ] **B8. GraphQL plumbing**: a `/graphql` endpoint using graphql-java's programmatic builder, a `ping` query, and the authenticated user available to resolvers. Needs B7.

## Phase 2: Getting data in

Goal: a user can get their transaction history into the system. Open banking is deferred, so this is how data arrives (see decisions).

- [ ] **D1. Accounts API**: GraphQL queries and mutations to list, create, rename and delete accounts. Needs B8.
- [ ] ⏸ **D2. Categories API + defaults**: GraphQL CRUD for categories (main category → subcategory, like Spiir, each with its `kind`), plus a seed of default categories taken from Spiir's category list. Needs B8. *Blocked:* the Spiir category list needs to be committed to the repo first (the maintainer has it).
- [ ] **D3. Transactions API**: GraphQL `transactions` (filter by account, date range and category, with pagination), `transaction`, `createTransaction`, `updateTransaction` and `deleteTransaction`. Needs D1, D2.
- [ ] **D4. CSV import, core**: upload a CSV for an account and map its columns (date, text, amount, optional balance) to fields. Handle Danish number and date formats (`1.234,56`, `dd-mm-yyyy`). Deduplicate so re-importing an overlapping file doesn't create duplicates. Needs D3.
- [ ] **D5. CSV import, bank presets**: saved column mappings for the major Danish banks (Danske Bank, Nordea, Jyske Bank, Lunar, Nykredit, Sydbank, Arbejdernes Landsbank). Each preset should come with an anonymized sample file in the tests. Needs D4.
- [ ] ⏸ **D6. Spiir export import** (#5): import a Spiir data export, including Spiir's categories, mapped onto ours. *Blocked:* needs an anonymized sample of Spiir's export format.
- [ ] **D7. Import source interface**: refactor the importers behind a small `TransactionSource` interface, so a paid aggregator (e.g. Lunch Flow) can be added later as an optional plugin. Don't implement an aggregator. Needs D4.

## Phase 3: Categorization

Goal: most bank lines get the right category automatically. The categorizers run as a pipeline in a fixed order, and the first match wins: **manual choice → user rules → own history → default merchant list → uncategorized**. A manual choice always wins and is never overwritten. The pipeline runs on import and on demand.

- [ ] **K1. Merchant key normalization**: a pure function that turns raw bank text into a stable merchant key, e.g. `Dankort-nota NETTO 1234 12.03` → `NETTO`. It strips card and payment prefixes, store numbers, dates and reference numbers. Store the key on each transaction. Table-driven tests over realistic anonymized lines from several Danish banks. Needs D3.
- [ ] **K2. Pipeline + user rules**: a `Categorizer` interface and the ordered pipeline, plus user-defined rules (match on merchant key or text, with an optional amount sign → category). GraphQL CRUD for rules. Needs K1.
- [ ] **K3. Learn from own history**: a categorizer that reuses the category the user most recently gave the same merchant key. Needs K2.
- [ ] **K4. Default merchant list**: a committed data file mapping common Danish merchant keys to default categories (Netto, Rema 1000, Føtex, DSB, Rejsekort, Netflix, …), used as the last categorizer. Community-maintained through PRs. Needs K2, D2.
- [ ] **K5. Recategorize past lines**: when a rule is added or a merchant's category is corrected, offer to apply it to past transactions with the same key, never touching manual choices. Needs K2.
- [ ] **K6. Transfer detection**: detect transfers between the user's own accounts (opposite amounts on two of their accounts within a few days) and give them a `transfer` category. Transfers are left out of income/spending aggregates. Users can confirm or undo a match. Needs D3, D2.

## Phase 4: Making sense of the data

Goal: the core Spiir features.
- [ ] **F2. Overview queries**: GraphQL aggregates for spending per category per month, income vs. expenses (from the category's `kind`, transfers excluded), and balance over time. Needs D3, K6.
- [ ] **F3. Budgets**: a monthly budget per category, plus budget-vs-actual queries. Needs F2.
- [ ] **F4. Savings goals**: a goal (target amount, optional date) linked to an account or tracked manually, with progress queries. Needs D3.
- [ ] **F5. Data export**: export all of a user's data as CSV/JSON, so users are never locked in the way they were with Spiir. Needs D3.

## Phase 5: Web client

Goal: a usable web app shipped in the compose stack. Use [mine.spiir.dk](https://mine.spiir.dk) as the UI reference. Stack: Vite + React + TypeScript + Tailwind. The client talks to the backend only through GraphQL (plus the login/logout/signup routes). These items can run in parallel with Phases 2–4 once their backend dependencies are merged.

- [ ] **W1. Scaffold**: a Vite + React + TypeScript + Tailwind app in `web/` with a placeholder page, routing, and a layout shell (nav + content area). Update `web/readme.md` with dev commands. Extend CI to run the web tests and type-check.
- [ ] **W2. Web container + compose**: a `Containerfile` that builds the static bundle and serves it from an unprivileged web server listening on a port ≥ 1024. The server reverse-proxies `/graphql` and the auth routes to `backend`. Add `web` to `compose.yaml` as the only service exposed to the host. Follow the Podman rules in `docs/decisions.md`. Needs W1, B5.
- [ ] **W3. GraphQL client**: a lightweight GraphQL client plus TypeScript types generated from the backend schema. Document how to regenerate the types. Needs W1, B8.
- [ ] **W4. Login and signup**: login and signup pages (the session cookie is set by the server, so there's no token handling in the client), logout, and redirect to login when unauthenticated. The signup page is hidden when the server has `ALLOW_SIGNUP=false`. Needs W3, B7.
- [ ] **W5. Accounts**: list, create, rename and delete accounts. Needs W4, D1.
- [ ] **W6. Transactions**: a transaction list filtered by account, date range and category, with pagination. Edit a transaction's category inline; create and delete transactions manually. Needs W5, D3.
- [ ] **W7. CSV import flow**: upload a file, pick a bank preset or map columns by hand, preview the parsed rows, confirm, then show a summary (imported / duplicates skipped). Needs W6, D4 (presets: D5).
- [ ] **W8. Categories and rules**: manage categories and subcategories, plus categorization rules with "apply to past transactions" (K5). Needs W6, D2, K2.
- [ ] **W9. Overview**: a dashboard showing spending per category per month, income vs. expenses, and balance over time. Needs W6, F2.
- [ ] **W10. Budgets**: set monthly budgets per category; show budget vs. actual. Needs W9, F3.
- [ ] **W11. Savings goals**: create goals and show progress. Needs W5, F4.
- [ ] **W12. Data export**: a button that downloads all the user's data. Needs W4, F5.

## Later / not now

- **Splitting** a transaction across several categories: delayed, not in the first version.

- **Open banking** (#3): optional aggregator plugin through D7. Deferred; see decisions.
- **Encryption of user data** (#19): needs its own design discussion. Note that zero-knowledge encryption conflicts with server-side categorization rules and aggregates.
- **Mobile app** (#2): paused, and the code was removed (see decisions). Needs a configurable server URL when it comes back.
- **Hosted deployment** (#20): paused, and the Pulumi/AWS code was removed (see decisions).

---

## Open decisions

Record each resolved one in `docs/decisions.md`, then update this roadmap.

- **Spiir export format** (D6): someone needs to provide an anonymized sample export.
- **Spiir category list** (D2): needs committing to the repo.
- **Machine-learning categorizer**: under discussion. It would be another categorizer in the K2 pipeline.
