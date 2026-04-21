# Web — Claude Code Instructions

## PR-by-PR workflow

Work through [TODO.md](TODO.md) **one item at a time**:

1. Git fetch and checkout `origin/main`.
2. Pick the next unchecked item.
3. Implement it on a new branch: `feat/web-<slug>` (e.g. `feat/web-tailwind`).
4. Mark the item done in `TODO.md`.
5. Open a **small, focused PR** — one logical change per PR, no bundling.
6. **Stop and tell the user** the PR URL. Do not start the next item until they say the PR is merged.

Never skip ahead or bundle multiple TODO items into one PR.

## Stack

- **Framework**: React + TypeScript, bundled with Vite
- **Styling**: Tailwind CSS
- **Compiler**: React Compiler (babel plugin)
- **Data fetching**: Relay + GraphQL

## Code style

- Functional components only — no class components.
- Co-locate styles with components; use Tailwind utility classes directly on JSX elements.
- Keep components small and focused; extract logic into custom hooks.
- Relay fragments should live in the same file as the component that owns them.
