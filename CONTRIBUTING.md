# Contributing to OriginChain

Thanks for your interest in contributing. This guide reflects how this
project actually works today, not generic boilerplate.

## Branching & Pull Requests

- Branch off **`dev`** (not `develop` — this project specifically uses `dev`
  as its integration branch).
- Use a descriptive feature-branch name, e.g. `feature/tagging-system`,
  `fix/asset-indexer-chunked-getlogs`, `docs/reconciliation-audit`.
- Open your PR **into `dev`**, not `main`.
- Delete the branch after merge.

## Commit Messages

This project uses conventional-commit-style prefixes, consistently, across
its full history:

- `feat:` — new functionality
- `fix:` — bug fixes
- `docs:` — documentation-only changes
- `refactor:` — code restructuring with no behavior change
- `chore:` — tooling, config, dependency, or housekeeping changes

Write the summary line in imperative mood and keep it concise; use the body
for the "why" when it's not obvious from the diff.

## Environment Setup

See the [Getting Started](README.md#getting-started) section of the root
README for prerequisites, install steps, environment variables, and how to
run the apps locally.

## Secret Handling

- **Never commit `.env` files.** Each app ships a `.env.example` — copy it,
  fill in real values locally, and keep the real file out of version control
  (already covered by `.gitignore`).
- Treat `.env.example` as the single source of truth for *which* variables
  are required; keep it up to date when you add a new one.
- If any credential (API key, JWT secret, deployer/test-wallet key) is ever
  exposed — committed by mistake, pasted somewhere public, left on a
  compromised machine — **rotate it immediately**, don't just remove it from
  the code. This matches the secret-handling practice already documented in
  [`docs/DEVELOPER_KICKOFF_BLUEPRINT.md`](docs/DEVELOPER_KICKOFF_BLUEPRINT.md#7-environment-strategy) (Section 7, Environment Strategy).
- Never log secret values, even in error traces.

## Testing Expectations

There is currently **no committed automated test suite** in this repository
(no `test` script in any workspace `package.json`). Verification has instead
been done through manual and scripted end-to-end testing each work session —
running real flows against a local database and testnet deployment and
checking results directly, rather than via a checked-in test harness.

If you add automated tests, that's welcome, but don't assume a test runner
or CI test gate exists today — verify your changes manually against a real
local environment before opening a PR, and describe what you tested in the
PR description.

## Code Style

- **TypeScript**: strict mode is enabled across both apps. Avoid `any`
  without a clear justification comment — this is a documented convention,
  not just a lint preference (see
  [`docs/DEVELOPER_KICKOFF_BLUEPRINT.md`](docs/DEVELOPER_KICKOFF_BLUEPRINT.md)).
- **Rust contracts** (`contracts/`): run `cargo fmt` and `cargo clippy`
  before submitting contract changes.
- Run `pnpm lint` (root) before opening a PR.

## Documentation

If your change causes `docs/` to diverge from the real implementation,
update the relevant doc in the **same PR** — this is an existing project
convention (see the "Responsibilities Beyond Code" section of
[`docs/TEAM_TASK_DISTRIBUTION.md`](docs/TEAM_TASK_DISTRIBUTION.md)).

## Code of Conduct

Participation in this project is governed by the
[Code of Conduct](CODE_OF_CONDUCT.md).
