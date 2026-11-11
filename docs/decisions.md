# Decision log

A dated record of project-level decisions and the reasoning behind them. Newest entries go at the bottom. When a decision is reversed, add a new entry that supersedes the old one rather than editing history.

The maintainer keeps this file. Contributors flag project-level decisions in their PR description, and the maintainer records them here.

Format: `## YYYY-MM-DD — Title`, then **Decision**, **Why**, and optionally **Consequences** / **Source**.

---

## 2026-04-16 — Recreate Spiir as an open-source project

**Decision:** Build an open-source replacement for [Spiir](https://spiir.dk), the Danish personal finance app, aiming for feature parity: transaction overview, categorization, budgets and savings goals.

**Why:** Spiir announced it would shut down on 2026-06-06.

**Source:** issues #1–#5.

## 2026-04-18 — Initial stack

**Decision:**
- Backend: Kotlin, http4k (Jetty), PostgreSQL, Hoplite config, HikariCP, Flyway, graphql-java (code-first, no SDL files), JWT auth. No ORM.
- App: React Native + Expo + NativeWind.
- Web: React + Tailwind (not started).
- Infrastructure: Pulumi (TypeScript) on AWS: VPC, EKS and RDS Postgres.

**Why:** Lightweight libraries over frameworks so the pieces are easy to replace. http4k was picked over Ktor and Spring Boot; Exposed and OpenAPI were dropped in favour of plain SQL and GraphQL.

**Source:** PRs #10–#26; `backend/CLAUDE.md`.

## 2026-11-11 — Project restarted after Spiir's shutdown

**Decision:** Resume work. The 2026-06-06 deadline (and the 2026-05-22 app store review date in #2) no longer applies. The goal is now a good self-hostable personal finance app in the spirit of Spiir, not a race to replace it before it closes.

**Why:** Spiir has closed. Work stopped on 2026-04-18 and is picking up again now.

## 2026-11-11 — Self-hosting first, hosted service kept possible

**Decision:** The first target is an app anyone can host themselves. A public hosted service stays a possible later goal, so we don't make choices that rule it out.

**Why:** A hosted service means holding other people's financial data, with the legal and security obligations that brings (see #19). Self-hosting avoids that and gets something usable sooner.

**Consequences:**
- All runtime config comes from environment variables, with no AWS-specific assumptions in the app.
- The data model stays multi-user (every row is scoped to a user), even though most self-hosted instances will have one or a few users. This keeps a hosted service possible.
- The Pulumi/AWS infrastructure (#20) is paused. It isn't needed to self-host, and it costs money while it runs. It stays in the repo for a possible hosted version later.

**Source:** #29.

## 2026-11-11 — Docker Compose as the deployment format, Podman-compatible

**Decision:** Ship self-hosting as a `compose.yaml` that works with both `docker compose` and `podman compose` / `podman-compose`.

**Why:** Compose is the most common way people self-host. Podman support matters to rootless and Fedora/RHEL users and costs little if we plan for it from the start.

**Consequences (rules for compose and image files):**
- Stick to the [Compose Specification](https://compose-spec.io/). No Docker-only extensions, and no top-level `version:` key.
- Use fully qualified image names (`docker.io/library/postgres:16`), because Podman doesn't assume Docker Hub.
- Make it rootless-friendly: no host ports below 1024 by default, containers don't need to run as root, and nothing mounts `docker.sock`.
- Prefer named volumes over bind mounts. Where a bind mount is needed, document the SELinux `:Z` label.
- Name the image build file `Containerfile` or `Dockerfile` (both tools accept either) and use only standard instructions. No BuildKit-only syntax such as `RUN --mount`, unless both tools have been checked to support it.

## 2026-11-11 — Open banking is not a priority

**Decision:** Don't build an automatic bank connection now. Transactions come in through manual entry and file import (bank CSV exports, plus Spiir exports where users have them). Design the import side so a paid aggregator can be plugged in later as an optional, user-configured source.

**Why:** Getting Danish bank data needs either an AIS licence (about 100,000 DKK a year plus a lot of manual integration work) or an aggregator subscription (the cheapest is about 20 DKK per account per month). Neither fits a free, self-hosted project. An aggregator such as [Lunch Flow](https://www.lunchflow.app/) could be added later for users willing to pay for it with their own account.

**Consequences:** Issue #3 is deferred. File import becomes the main way data gets in and has to be good.

**Source:** #29, #3.

## 2026-11-11 — Contribution policy: AI-assisted code allowed, small PRs

**Decision:** AI-assisted ("vibecoded") contributions are welcome. PRs must be small and focused so they can be reviewed.

**Why:** The maintainer has little time and depends on agents, so reviewability is the bottleneck.

**Consequences:** Work is organized as a roadmap of PR-sized items (`ROADMAP.md`) that an agent can pick up one at a time.

**Source:** #29.

## 2026-11-11 — Web client first

**Decision:** Build the web client (`web/`) before the mobile app. The web client is a static React + TypeScript + Tailwind app built with Vite. It runs in its own container in the compose stack, and that container also reverse-proxies the API, so browser and API share one origin.

**Why:** A web client is the easiest thing to self-host: one `compose up` gives a working app at one URL, with no app store and no separate server-URL setup. Serving everything from one origin avoids CORS and the need to configure the API URL. The mobile app comes later.

**Consequences:** The mobile app (`app/`) is paused. It will need a configurable server URL when work resumes. [mine.spiir.dk](https://mine.spiir.dk) (#1) is the UI reference.

## 2026-11-11 — Assistant and Challenges are out of scope

**Decision:** Spiir's "Assistant" and "Challenges" features won't be built.

**Why:** They aren't part of the core: import, categorize, budget, save.

**Consequences:** The mock `AssistantScreen` and `ChallengesScreen` in `app/` will be removed (roadmap item A1).

## 2026-11-11 — Remove paused code from the repo

**Decision:** Delete the paused mobile app (`app/`) and the Pulumi/AWS infrastructure (`infrastructure/`) from the repo instead of leaving them in place.

**Why:** Paused code confuses contributors and agents, who may try to extend or "fix" it. Git history keeps it, so it can be restored if needed.

**Consequences:**
- To restore either, check it out from commit `243524f`, the last commit that contains both: `git checkout 243524f -- app` or `git checkout 243524f -- infrastructure`.
- Roadmap item A1 (removing the Assistant and Challenges screens) is dropped, because the whole app is gone.
- The Pulumi stack was never deployed, so there are no AWS resources to clean up.

## 2026-11-11 — GitHub issues and labels drive agent work

**Decision:** Each roadmap item becomes a GitHub issue with a fixed structure: goal, context, requirements, acceptance criteria, tests, out of scope. Issues ready for pickup get the `agent-ready` label. Each issue has exactly one `area:*` label, and only one issue per area may be `in-progress` at a time. Every PR must include tests. The details are in `docs/agent-workflow.md`.

**Why:** Several agents work in parallel with little supervision. Issues give them self-contained specs. Area labels stop two agents from editing the same code at once. Required tests stand in for close human review.

**Consequences:** Added a CI roadmap item (CI1), because required tests are worth little unless something runs them.

## 2026-11-11 — Separate implementer and reviewer roles; agents record work in commits and PRs

**Decision:**
- Agents have one role per session. Implementers follow `docs/agent-workflow.md`; reviewers follow `docs/review-workflow.md`. Reviewers never review their own work and never push to a PR they review. Review verdicts use labels (`needs-review`, `changes-requested`, `review-passed`), and the maintainer merges.
- Agents record what they did and why in commit messages and the PR description (template: `.github/pull_request_template.md`). They don't edit `ROADMAP.md` or this file: the maintainer ticks roadmap items after merge and records decisions flagged in PRs.
- `AGENTS.md` is the canonical agent instruction file, so agents other than Claude find it too. `CLAUDE.md` imports it.
- The maintainer's project-management workspace lives in `pm/`, and agents don't read it.

**Why:**
- Independent review catches what the author misses.
- Editing shared files like the roadmap and decision log in parallel PRs causes merge conflicts.
- Commit and PR history is the natural record of the work.
- Agents should work only from issues, not from the maintainer's planning notes.

**Consequences:** All agents may post through one GitHub account, which can't formally approve its own PRs, so review verdicts are labels plus comments.

## 2026-11-11 — Automatic merging

**Decision:** A PR merges automatically once a review agent has passed it, CI is green and no review threads are unresolved. No human merge step.

**Why:** The maintainer shouldn't be the bottleneck. Independent agent review, required tests and resolved threads together act as the quality gate.

**Consequences:**
- Only reviewers resolve review threads; implementers reply but never resolve.
- Because reviewing is the final gate, reviewers shouldn't pass a PR they're unsure about.
- The exact mechanism (a separate reviewer account or GitHub App with real approvals, or a label-triggered merge workflow) depends on the GitHub setup.

## 2026-11-11 — Review agents act as a GitHub App

**Decision:** Review agents authenticate as a dedicated GitHub App. Implementing agents use the maintainer's account. Verdicts are real GitHub reviews (Approve / Request changes). An approval from the App, green CI and resolved conversations together trigger GitHub's auto-merge, with merge commits so each PR's commit history is kept. This replaces the `changes-requested` / `review-passed` labels; `needs-review` stays as the reviewers' queue.

**Why:** GitHub doesn't let an account approve its own PRs. A separate identity makes approvals real, so the built-in branch protection and auto-merge can be used instead of a custom merge workflow. A GitHub App was picked over a second user account.

## 2026-11-11 — Backend: plain JDBC, session cookies, keep GraphQL, Java 25

**Decision:**
- **Database access:** plain JDBC behind small repository classes. No ORM, jOOQ or query builder.
- **Auth:** server-side sessions in a `sessions` table, sent as an httpOnly `SameSite=Lax` cookie. JWT is dropped. This supersedes "JWT auth" in the 2026-04-18 stack entry.
- **API:** GraphQL stays.
- **JDK:** Java 25, the current LTS (released September 2025; the next LTS is 29, due September 2027). It replaces the 21 toolchain.
- **Podman:** contributors on Podman run Testcontainers through Podman's Docker-compatible socket.

**Why:**
- Plain JDBC: no extra dependencies or code generation, and it's easy for both agents and new contributors to follow.
- Sessions: browser and API share one origin, so a cookie is simpler and safer than a bearer token in browser storage. Server-side sessions can also be revoked, which JWTs can't easily be.
- GraphQL: the maintainer finds it simplifies the frontend logic a lot.
- Java 25: the newest LTS, supported by our Gradle 9.4 and Kotlin 2.3.

## 2026-11-11 — Categorization approach

**Decision:**
- Categorizers run as a pipeline in a fixed order, and the first match wins: manual choice → user rules → the user's own history (by normalized merchant key) → a community-maintained default list of Danish merchants → uncategorized. Manual choices are never overwritten.
- Raw bank text is normalized to a merchant key before matching.
- Whether a line is income, expense or transfer comes from its **category's kind**, not the sign of the amount.
- **Transfers** between the user's own accounts are detected and left out of income and spending.
- **Splitting** a transaction across categories is delayed until after the first version.
- The default categories come from **Spiir's category list**.

**Why:** Spiir's auto-categorization drew on data from all its users, which a self-hosted instance doesn't have. Merchant keys, the user's own history (which a Spiir export can fill on day one) and a shared default list come close without any central data. Without transfer detection, budgets and overviews are wrong for anyone with several accounts.

**Consequences:** New roadmap phase K (K1–K6). The F1 rules item is folded into K2. D2 is blocked until the Spiir category list is in the repo.

## 2026-11-11 — ML categorizer as an optional Python service

**Decision:** Machine-learning categorization lives in a separate Python service (`categorizer/`) running in its own container.
- It's **optional**: off by default in `compose.yaml`, and the app works fully without it.
- The backend calls it over HTTP as one categorizer in the pipeline, after the default merchant list. It only uses predictions above a confidence threshold, and errors or timeouts fall through.
- The service has **no database access**: the backend sends it training data and it stores per-user models. It makes **no outbound network calls**, so financial data never leaves the user's own stack.
- It's treated as a **playground**: nothing else on the roadmap depends on it, and there's an evaluation harness for measuring whether changes help.

**Why:** Python has the ML ecosystem. The maintainer has no ML experience and wants room to experiment without blocking the core app. Keeping it behind an HTTP API, with no direct database access, means the service can be rewritten or dropped freely.

**Consequences:** New roadmap items M1–M3 and a new `area:ml` label. The Python stack (frameworks, libraries, tooling) isn't decided yet; the maintainer will work it out with a specialist, and M1 is blocked until then.
