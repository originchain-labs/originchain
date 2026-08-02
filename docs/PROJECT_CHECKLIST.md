# OriginChain — Project Checklist

Practical, granular tasks grouped by domain. Check off as you go — this is the working task list underneath `DEVELOPMENT_ROADMAP.md`.

## Repository

- [ ] Create `apps/`, `contracts/`, `packages/`, `docs/`, `scripts/` top-level folders
- [ ] Initialize npm/pnpm workspace at root (`package.json` with `workspaces`)
- [ ] Initialize Cargo workspace at `contracts/Cargo.toml`
- [ ] Add root `.gitignore` (Node, Rust/Stylus, env files — see `REPOSITORY_STRUCTURE.md`)
- [ ] Add `packages/shared-types` package skeleton
- [ ] Add `packages/config` (shared tsconfig, eslint, prettier)
- [ ] Add root `README.md` linking to `docs/DEVELOPER_KICKOFF_BLUEPRINT.md`
- [ ] Add `.env.example` files per app

## Frontend

- [ ] Scaffold Next.js app in `apps/frontend` (TypeScript, App Router)
- [ ] Install Tailwind CSS + configure design tokens
- [ ] Install shadcn/ui, initialize component library
- [ ] Install Framer Motion
- [ ] Install RainbowKit + Wagmi + Viem, configure Arbitrum chains (mainnet + testnet)
- [ ] Build wallet connect flow (connect, disconnect, session persistence)
- [ ] Scaffold routing for all 16 screens (placeholder pages first)
- [ ] Build shared layout components (nav, footer, auth-gated wrapper)
- [ ] Build creator onboarding form
- [ ] Build `hooks/` (`useWallet`, `useCreator`, `useAsset`, `useReview`, `useAnalytics`)
- [ ] Build asset upload UI with client-side hash preview
- [ ] Build Proof of Origin Certificate display/download UI
- [ ] Build public verification page (no wallet required)
- [ ] Build creator profile/portfolio page
- [ ] Build collector/visitor browse & search screens
- [ ] Build organization dashboard screens
- [ ] Build admin screens
- [ ] Build review submission + display components
- [ ] Build reputation display component
- [ ] Build analytics dashboard views
- [ ] Wire frontend API calls to backend via `shared-types` client

## Backend

- [ ] Scaffold Express app in `apps/backend` (TypeScript)
- [ ] Set up Prisma, connect to PostgreSQL
- [ ] Implement wallet-signature session auth (nonce + verify, with expiry + single-use)
- [ ] Build `routes/` → `controllers/` → `validators/` layering per resource
- [ ] Build `/api/v1/creators` endpoints (see `API_SPECIFICATION.md`)
- [ ] Build `/api/v1/assets` endpoints
- [ ] Build `/api/v1/reviews` endpoints
- [ ] Build `/api/v1/reputation` endpoints
- [ ] Build `/api/v1/analytics` endpoints
- [ ] Build `/search` endpoint (unified creators/assets/tags search)
- [ ] Build `/health` endpoint
- [ ] Build `/contracts` status/debug endpoint
- [ ] Build Blockchain Service (`services/blockchain/`): contract registry, tx executor, gas estimation, retries, event decoder, error translation
- [ ] Build Storage Service (`services/storage/`): interface + Pinata provider implementation
- [ ] Build AI Provider Layer (`services/ai/`): provider interface + OpenAI implementation, metadata/tags/descriptions/analytics orchestration, centralized prompts
- [ ] Build Proof of Origin Certificate generator (`services/certificate/`)
- [ ] Build contract event indexer worker (listens via Blockchain Service, writes to Postgres)
- [ ] Add request validation (zod) per resource in `validators/`
- [ ] Add centralized error handling middleware (including chain-error translation from Blockchain Service)
- [ ] Add rate limiting on public endpoints
- [ ] Add Helmet, CSP, and explicit CORS allow-list
- [ ] Add structured request logging

## Database

- [ ] Finalize schema per `DATABASE_SCHEMA.md`
- [ ] Write Prisma schema file
- [ ] Run initial migration
- [ ] Seed script for local dev (sample creators/assets)
- [ ] Add indexes for search-heavy fields (creator address, asset hash, tags)

## Wallet

- [ ] Configure supported wallets (MetaMask, WalletConnect, Coinbase Wallet at minimum)
- [ ] Implement sign-in-with-Ethereum-style message signing for session auth
- [ ] Handle network switching prompt (force Arbitrum)
- [ ] Handle disconnect/session expiry gracefully in UI

## Blockchain / Contracts

- [ ] Set up local Stylus dev environment (Cargo, `cargo stylus`, local node)
- [ ] Define `CreatorRegistry` interface (see `SMART_CONTRACT_INTERFACES.md`)
- [ ] Define `AssetRegistry` interface
- [ ] Define `ReviewRegistry` interface
- [ ] Define `ReputationManager` interface
- [ ] Implement `CreatorRegistry` logic + unit tests
- [ ] Implement `AssetRegistry` logic + unit tests
- [ ] Implement `ReviewRegistry` logic + unit tests
- [ ] Implement `ReputationManager` logic + unit tests
- [ ] Deploy all four to Arbitrum testnet
- [ ] Record deployed addresses in `packages/shared-types/constants.ts`
- [ ] Generate/verify ABI-equivalent TypeScript types for frontend/backend use

## IPFS

- [ ] Set up Pinata account + API keys
- [ ] Build pin-file helper (backend)
- [ ] Build pin-JSON (metadata) helper (backend)
- [ ] Verify CID retrieval via public gateway
- [ ] Decide and document pinning retention policy (who pays, what gets unpinned)

## AI

- [ ] Design metadata generation prompt (title/description/tags from asset + creator input)
- [ ] Implement OpenAI API call wrapper (backend)
- [ ] Add human-in-the-loop edit step before AI metadata is finalized
- [ ] Implement analytics summarization (creator dashboard insights)
- [ ] Add basic cost/rate guardrails on AI calls

## Security

- [ ] Ensure client-side hash is always computed and shown before upload
- [ ] Never trust client-submitted hash without server-side re-verification pre-registration
- [ ] Validate all file uploads (size/type limits) before pinning
- [ ] Validate actual MIME type of uploads (not just file extension)
- [ ] Validate/re-encode uploaded images before pinning
- [ ] Sanitize all user-submitted text (profile bios, review content)
- [ ] Ensure deployer/private keys are never committed (confirm `.gitignore` coverage)
- [ ] Add basic abuse/spam protection on review submission (rate limit + wallet-based)
- [ ] Enforce nonce expiration (5 min) and single-use on `/auth/nonce` + `/auth/verify`
- [ ] Add Helmet + Content Security Policy
- [ ] Restrict CORS to deployed frontend origin(s), no wildcard
- [ ] Validate required env vars at startup (fail fast if missing)
- [ ] Confirm no secret values ever appear in logs

## Metadata & Versioning

- [ ] Add `version` + `schema` fields to all pinned metadata JSON (asset and profile)
- [ ] Write metadata parser that dispatches by `schema`/`version`
- [ ] Document schema versions as they're introduced in `docs/`

## Testing

- [ ] Unit tests for each Stylus contract
- [ ] Integration test: full creator onboarding flow
- [ ] Integration test: full asset registration flow
- [ ] Integration test: verification flow (hash match/mismatch cases)
- [ ] Backend API endpoint tests (happy path + validation failures)
- [ ] Frontend component smoke tests for critical flows

## Deployment

- [ ] Provision PostgreSQL on Railway
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Confirm environment variables set correctly in both platforms
- [ ] Deploy contracts to Arbitrum testnet (pre-hackathon-demo checkpoint)
- [ ] Smoke test full flow on deployed environment before demo

## Documentation

- [ ] Keep `DEVELOPER_KICKOFF_BLUEPRINT.md` updated as architecture evolves
- [ ] Document any deviation from `SMART_CONTRACT_INTERFACES.md` when contracts are implemented
- [ ] Maintain `.env.example` files as new secrets are introduced
- [ ] Write a short demo script for hackathon judges (separate from this pack)
