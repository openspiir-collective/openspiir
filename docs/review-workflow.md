# Reviewer workflow

How a review agent (or human) reviews a PR. Implementers follow [agent-workflow.md](agent-workflow.md) instead.

Reviewers only review. **Never review a PR you wrote, and never push commits to a PR you're reviewing.** If a fix is obvious, describe it in a comment and let the implementer make it.

## Picking a PR

1. Find an open PR labelled `needs-review`.
2. Skip it if you wrote it or committed to it in this session.
3. Review one PR at a time.

## What to check

Read the linked issue first: it defines what "done" means. Then check, in this order:

1. **Acceptance criteria:** each criterion in the issue is met. Check each one against the code, not against the PR description.
2. **Tests:**
   - The tests the issue asks for exist and test real behaviour (not just that code runs).
   - Failure and edge cases are covered: bad input, empty data, duplicates, another user's data.
   - Database code is tested against real Postgres (Testcontainers), not mocks.
   - CI is green. If there's no CI yet, say in the review that tests weren't verified.
3. **Correctness:** bugs, unhandled errors, off-by-one errors, time zone and date handling, money handled as floats (it must be integer minor units).
4. **Security and data isolation:**
   - Every query is scoped to the authenticated user.
   - No secrets in code.
   - Passwords are hashed with argon2/bcrypt.
   - No real personal financial data in fixtures.
5. **Scope:** the PR does only what the issue asks. Unrelated refactors, extra features and changes outside the issue's `area:*` are reasons to ask for changes.
6. **Project rules:** the constraints in [AGENTS.md](../AGENTS.md), [decisions.md](decisions.md) (especially the Podman/Compose rules), and the per-package `AGENTS.md`.
7. **The record:**
   - The PR description fills in Summary, Decisions, Deviations, Testing and Follow-ups.
   - Commit messages explain why.
   - Any project-level decision is flagged in the PR.
8. **Simplicity:** the code is understandable by a new contributor, and there are no needless abstractions.

## Writing the review

- Leave review comments on specific lines. Mark each one **blocking** or **nit**. Nits never block.
- Finish with one summary comment containing:
  - the verdict;
  - the blocking points, as a list;
  - which acceptance criteria you verified;
  - anything you couldn't verify.
- Submit it as a GitHub review: **Request changes** if there's at least one blocking point, otherwise **Approve**. Then remove the `needs-review` label.
- Don't merge by hand. **Merging is automatic** once the PR is approved, CI is green and every review thread is resolved. Your verdict is therefore the last human-like gate, so don't pass a PR you have doubts about.

## Resolving threads

Unresolved review threads block the automatic merge.
- Only reviewers resolve threads. Resolve a thread once its point has been addressed, by a fix or a convincing reply.
- Resolve nits too once you've read the implementer's response, even if they chose not to change anything. Nits never block.
- Never pass a PR while one of your blocking threads is still unresolved.

Reviewers act as the project's review GitHub App, a separate identity from the implementers, which is why approving works. If you find yourself authenticated as the PR's author, stop: you're not set up as a reviewer.

## Re-review

When a PR comes back as `needs-review` after changes, check that each blocking point was addressed (by a fix or a convincing reply), resolve the threads that are, and check the new commits. Don't raise new nits on code that hasn't changed.
