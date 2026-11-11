# Project management

The project-manager agent's to-do list and running log. **Only the maintainer and the PM agent use `pm/`.** Implementing and reviewing agents are told not to read it (see `AGENTS.md`). The PM agent keeps `ROADMAP.md`, `docs/decisions.md` and the GitHub issues in sync, and keeps the repo in shape. It doesn't implement features; specialist work goes to other agents through issues.

## Recurring duties

- Turn each `ROADMAP.md` item into a GitHub issue following [agent-workflow.md](../docs/agent-workflow.md), with exactly one `area:*` label.
- Merges are automatic, so check regularly for newly merged PRs. After each merge: tick the item in `ROADMAP.md`. Record any project-level decision flagged in the PR's "Decisions" section in `docs/decisions.md`. Open issues for any "Follow-ups" worth doing.
- Add `agent-ready` to an issue once it's fully specified and every issue in its *Depends on* list is merged. Check this after each merge.
- Keep the roadmap ↔ issue mapping current: once an item has an issue, add its number to the item in `ROADMAP.md`, e.g. `**B2. Hoplite config** (#31)`.
- Record project-level decisions in `decisions.md` as they're made, and commit as we go.
- Remove ⏸ markers and open decisions from `ROADMAP.md` when they're resolved.

## Pending actions

Tick an action when it's done; add new ones at the bottom.

- [ ] **Get GitHub write access for the PM agent** (maintainer). Either install `gh` and run `gh auth login`, or provide a token in an environment variable.
- [ ] **Set up the review GitHub App and automatic merging** (maintainer, with a specialist). Gate: an approval from the review App, CI green, all conversations resolved, merge commits allowed. Once CI1 is merged, its check needs to be made required.
- [ ] **Create labels:** `agent-ready`, `in-progress`, `area:backend`, `area:web`, `area:selfhost`, `area:docs`, `needs-review`.
- [ ] **Create issues for every roadmap item:** CI1, B2–B9, D1–D7, K1–K6, F2–F5, W1–W12. Area labels: B4, B5, W2 and CI1 → `area:selfhost`; other B, D, K and F items → `area:backend`; W items → `area:web`. Add the issue numbers to `ROADMAP.md`.
- [ ] **Add `agent-ready` to the first issues:** CI1, B2, B9 and W1 have no unmerged dependencies (B2 and B9 are both `area:backend`, so only one at a time). B4 needs B9 (Java 25) and shares `area:selfhost` with CI1, so it waits for both.
- [ ] **Triage the old epics** (proposed; maintainer to confirm):
  - Close #2 (app) and #20 (infrastructure) as paused, linking to `decisions.md`.
  - Close #4 (server) as replaced by the roadmap issues.
  - Keep #1 (website) and #5 (Spiir import) open as umbrella issues, with a comment linking their roadmap items.
  - Keep #3 (open banking) and #19 (encryption) open as paused discussions, with a comment summarising the current decision.
- [ ] **Get the Spiir category list into the repo** (the maintainer has it), then unblock D2.
- [ ] **Decide on a machine-learning categorizer** (under discussion).
- [ ] **Unblock D6 (Spiir import)** once another agent has added `docs/spiir-export-format.md` and an anonymized sample export: remove ⏸ from D6 in `ROADMAP.md`, remove the "Spiir export format" open decision, and create D6's issue.

## Log

- **2026-11-11:** Project restarted. Wrote the decision log and roadmap. Decided on self-hosting first, Compose with Podman support, open banking deferred, web client first, and Assistant/Challenges out of scope. Removed `app/` and `infrastructure/`. Set up the issue-based agent workflow (labels, issue format, testing rules). Waiting for GitHub access to create issues.
- **2026-11-11:** Prepared the repo for implementing and reviewing agents. `AGENTS.md` is now the canonical instruction file (`CLAUDE.md` imports it). Added the reviewer workflow and a PR template. Agents no longer edit the roadmap or decision log. PM files moved to `pm/`, which agents are told not to read.
- **2026-11-11:** Maintainer decided merging will be automatic (review passed + CI green + no unresolved review threads). Updated the workflow docs: reviewers resolve threads, implementers don't.
- **2026-11-11:** Review agents will act as a GitHub App, so they can formally approve. Verdicts are now real GitHub reviews; the `changes-requested` and `review-passed` labels are dropped.
- **2026-11-11:** Backend decisions: plain JDBC, session cookies, GraphQL kept, Java 25. Categorization decisions: pipeline order, merchant keys, transfer detection, splitting delayed, category kinds. Added roadmap phase K. Machine learning under discussion.
