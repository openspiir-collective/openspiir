# Project management

The project-manager agent's to-do list and running log. The PM agent keeps `ROADMAP.md`, `docs/decisions.md` and the GitHub issues in sync, and keeps the repo in shape. It doesn't implement features; specialist work goes to other agents through issues.

## Recurring duties

- Turn each `ROADMAP.md` item into a GitHub issue following [agent-workflow.md](agent-workflow.md), with exactly one `area:*` label.
- Add `agent-ready` to an issue once it's fully specified and every issue in its *Depends on* list is merged. Check this after each merge.
- Keep the roadmap ↔ issue mapping current: once an item has an issue, add its number to the item in `ROADMAP.md`, e.g. `**B2. Hoplite config** (#31)`.
- Record project-level decisions in `decisions.md` as they're made, and commit as we go.
- Remove ⏸ markers and open decisions from `ROADMAP.md` when they're resolved.

## Pending actions

Tick an action when it's done; add new ones at the bottom.

- [ ] **Merge `docs/project-restart` into `main`** (maintainer). Issues link to `docs/agent-workflow.md`, so it must be on `main` before any issue is labelled `agent-ready`.
- [ ] **Get GitHub write access for the PM agent** (maintainer). Either install `gh` and run `gh auth login`, or provide a token in an environment variable.
- [ ] **Create labels:** `agent-ready`, `in-progress`, `area:backend`, `area:web`, `area:selfhost`, `area:docs`.
- [ ] **Create issues for every roadmap item:** CI1, B2–B8, D1–D7, F1–F5, W1–W12. Area labels: B4, B5, W2 and CI1 → `area:selfhost`; other B, D and F items → `area:backend`; W items → `area:web`. Add the issue numbers to `ROADMAP.md`.
- [ ] **Add `agent-ready` to the first issues:** CI1, B2 and W1 have no unmerged dependencies. B4 only needs B1, which is done, but it's `area:selfhost`, the same area as CI1, so it waits until CI1 is merged.
- [ ] **Triage the old epics** (proposed; maintainer to confirm):
  - Close #2 (app) and #20 (infrastructure) as paused, linking to `decisions.md`.
  - Close #4 (server) as replaced by the roadmap issues.
  - Keep #1 (website) and #5 (Spiir import) open as umbrella issues, with a comment linking their roadmap items.
  - Keep #3 (open banking) and #19 (encryption) open as paused discussions, with a comment summarising the current decision.
- [ ] **Unblock D6 (Spiir import)** once another agent has added `docs/spiir-export-format.md` and an anonymized sample export: remove ⏸ from D6 in `ROADMAP.md`, remove the "Spiir export format" open decision, and create D6's issue.

## Log

- **2026-11-11:** Project restarted. Wrote the decision log and roadmap. Decided on self-hosting first, Compose with Podman support, open banking deferred, web client first, and Assistant/Challenges out of scope. Removed `app/` and `infrastructure/`. Set up the issue-based agent workflow (labels, issue format, testing rules). Waiting for GitHub access to create issues.
