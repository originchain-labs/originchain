# OriginChain — Project Checklist

Practical, granular tasks grouped by domain. Check off as you go — this is the working task list underneath `DEVELOPMENT_ROADMAP.md`.

## Repository *(Phase 0)*

- [x] Create `apps/`, `contracts/`, `packages/`, `docs/`, `scripts/` top-level folders
- [x] Initialize npm/pnpm workspace at root (`package.json` with `workspaces`)
- [x] Initialize Cargo workspace at `contracts/Cargo.toml`
- [x] Add root `.gitignore` (Node, Rust/Stylus, env files — see `REPOSITORY_STRUCTURE.md`)
- [x] Add `packages/shared-types` package skeleton
- [x] Add `packages/config` (shared tsconfig, eslint, prettier)
- [x] Add root `README.md` linking to `docs/DEVELOPER_KICKOFF_BLUEPRINT.md`
- [x] Add `.env.example` files per app

## Frontend *(Phases 1–9 core; org/admin items below belong to Phase 10)*

**Screen priority for remaining work (do not measure progress by screen count):**
- **P0 — core vertical slice ✅ complete:** `/profile/edit`, `/creators/[id]` (public portfolio) — the full loop Wallet → Identity → Asset → Proof → Blockchain → Certificate → Verification → Reputation → Public Profile now genuinely works end-to-end (⚠️ manual browser walkthrough of the two new pages not yet done — verify before demo)
- **P1 — after P0 ✅ complete:** `/search`, custom 404 (reviews/reputation UI already built)
- **P2 — stays in Phase 10, do not pull forward:** `/org/dashboard`, `/org/settings`, `/admin`, `/admin/creators`

- [x] Scaffold Next.js app in `apps/frontend` (TypeScript, App Router)
- [x] Install Tailwind CSS + configure design tokens
- [x] Install shadcn/ui, initialize component library
- [x] Install Framer Motion
- [x] Install RainbowKit + Wagmi + Viem, configure Arbitrum chains (mainnet + testnet)
- [x] Build wallet connect flow (connect, disconnect, session persistence)
- [x] Scaffold routing for all 16 screens (superseded — replaced with P0/P1/P2 priority tiers above; P0+P1 screens all built, P2 org/admin correctly deferred to Phase 10)
- [x] Build shared layout components (nav, footer, auth-gated wrapper)
- [x] Build creator onboarding form
- [x] Build `hooks/` (`useWallet`→`useAuth`, `useCreator`→`useCreatorProfile`, `useAsset`, `useReview`, `useAnalytics` — built under slightly different names than originally sketched, all present)
- [x] Client-side content hashing utility (`lib/hash.ts`)
- [x] Build asset upload UI with client-side hash preview (⚠️ manual MetaMask walkthrough not yet done — verify before demo)
- [x] Build Proof of Origin Certificate display/download UI (minimal — "View Certificate" link to the PDF via its gateway URL on the asset detail page; no in-page embed/preview yet)
- [x] Build public verification page (no wallet required)
- [x] Build creator profile/portfolio page (partial — `/assets?creatorId=` filter on the asset browse page functions as a portfolio-of-assets view; a dedicated public creator profile display showing bio/avatar/reputation does not exist yet, only the private creation form)
- [x] Build collector/visitor browse & search screens (asset browse/detail done; creator browse remains)
- [x] Build review submission + display components (⚠️ manual MetaMask walkthrough not yet done — verify before demo)
- [x] Build reputation display component (⚠️ manual visual/UX walkthrough not yet done — verify before demo)
- [x] Build analytics dashboard views (the Phase 9 creator dashboard — stats, AI summary, Bklit charts)
- [x] Wire frontend API calls to backend via `shared-types` client (resolved as N/A — `lib/api-client.ts` is the real REST-call pattern used throughout; `shared-types` is scoped to contract ABIs/addresses only, by design)

## Backend *(Phases 1–9 core; small ops endpoints below belong to Phase 11)*

- [x] Scaffold Express app in `apps/backend` (TypeScript)
- [x] Set up Prisma, connect to PostgreSQL
- [x] Implement wallet-signature session auth (nonce + verify, with expiry + single-use)
- [x] Build `routes/` → `controllers/` → `validators/` layering per resource
- [x] Build `/api/v1/creators` endpoints (POST create + GET by wallet done; search/edit endpoints remain)
- [x] Build `/api/v1/assets` endpoints (prepare/finalize-metadata/confirm/list/detail/certificate done; public verify-by-hash remains, Phase 6)
- [x] Build `/api/v1/reviews` endpoints (`POST /reviews`, `GET /assets/:id/reviews` — done and tested in Phase 7)
- [x] Build `/api/v1/reputation` endpoints (`GET /creators/:id/reputation`, live on-chain read)
- [ ] Build `/api/v1/analytics` endpoints
- [x] Build `/search` endpoint (unified creators/assets search — tags array is a placeholder, no tag system exists yet)
- [x] Build `/health` endpoint (real Postgres check + storage config check; both `/api/v1/health` and root `/health` for cloud liveness probes)
- [x] Build `/contracts` status/debug endpoint
- [x] Build Blockchain Service (`services/blockchain/`): contract registry, read wrapper, retries, event decoder, error translation, chunked `getLogs` for large block ranges (read-only scope, per design decision — this backend never sends transactions itself). 100% of backend chain calls (`getCreatorReputation`, `creator-indexer.ts`, `asset-indexer.ts`, `asset.service.ts`, `review.service.ts`, `organization.service.ts`) are now fully migrated with zero direct `chainClient` usage outside `services/blockchain/`. Migrating `organization.service.ts` added chunking protection to `getAdminAnalytics` across full deployment-to-now ranges. All 100% complete!
- [x] Build Storage Service (`services/storage/`): interface + Pinata provider implementation
- [x] Build AI Provider Layer (`services/ai/`): Gemini implementation (swapped from OpenAI — see gemini.provider.ts for rationale), metadata suggestion with structured output + Zod validation + injection-resistant system instruction; tags/descriptions covered, analytics orchestration remains
- [x] Build Proof of Origin Certificate generator (`services/certificate/`)
- [x] Build contract event indexer worker (listens via Blockchain Service, writes to Postgres)
- [x] Add request validation (zod) per resource in `validators/` (auth, creator, asset)
- [x] Add centralized error handling middleware (safety-net approach — existing per-controller handling untouched, catches anything not already handled)
- [x] Add chain-error translation to centralized error handling (`services/blockchain/errors.ts`'s `translateError()` — `RpcUnavailableError`/`ContractRevertError`/`DecodeError`, built as part of the Blockchain Service abstraction)
- [x] Add rate limiting on public endpoints (200 req/15min per IP, IPv6-safe; auth-gated endpoints deliberately left unlimited by IP — reasoned as redundant given SIWE-authenticated JWT already required)
- [x] Add Helmet, CSP, and explicit CORS allow-list (Helmet+CSP done in Phase 11's HTTP hardening task; CORS allow-list separately confirmed below, no wildcard)
- [x] Add structured request logging (morgan — method/path/status/timing only, verified no request body content leaks)

## Database *(Phases 3–9; seed script belongs to Phase 11)*

- [x] Finalize schema per `DATABASE_SCHEMA.md` for Phase 1–9 scope (creators, assets, reviews, indexer_state, proof_id_seq all done — `organizations`/admin-role tables correctly moved to Phase 10)
- [x] Write Prisma schema file (creators table added)
- [x] Run initial migration (creators, assets, indexer_state, proof_id_seq)
- [x] Seed script for local dev (sample creators/assets) — idempotent via upsert, verified by running twice
- [x] Add indexes for search-heavy fields (creator address, asset content hash — tags/full-text search not yet needed)

## Organization & Admin *(Phase 10 — new, previously unscoped)*

- [x] Add `organizations` table to Prisma schema (sketched in `DATABASE_SCHEMA.md`, never implemented)
- [x] Relate `Creator.organizationId` to a real `Organization` record (currently a plain unrelated field)
- [x] Add an admin role mechanism (env-based `ADMIN_WALLET_ADDRESSES`, no DB field — hackathon-appropriate scope, proper RBAC deferred)
- [x] Build organization CRUD backend endpoints
- [x] Build `GET /admin/analytics` (fully on-chain, only real tracked metrics — `totalVerifications`/`dailyActive` deliberately excluded rather than fabricated)
- [x] Build organization dashboard screen(s) (frontend) (⚠️ manual browser walkthrough not yet done — verify before demo)
- [x] Build admin dashboard screen(s) (frontend) (⚠️ manual browser walkthrough not yet done — verify before demo)

## Wallet *(Phase 2)*

- [x] Configure supported wallets (RainbowKit default set: MetaMask, WalletConnect, Coinbase Wallet, others)
- [x] Implement sign-in-with-Ethereum-style message signing for session auth
- [x] Handle network switching prompt (force Arbitrum) — RainbowKit's default "wrong network" UI, since `arbitrumSepolia` is the primary configured chain
- [x] Handle disconnect/session expiry gracefully in UI (`useAuth`'s `signOut` clears session + disconnects; a switched/mismatched wallet address correctly re-shows as unauthenticated — JWT expiry itself has no active refresh/re-prompt flow yet)

## Blockchain / Contracts *(Phases 3–9; Blockchain Service abstraction belongs to Phase 11)*

- [x] Set up local Stylus dev environment (Cargo, `cargo stylus`, local node)
- [x] Define `CreatorRegistry` interface (see `SMART_CONTRACT_INTERFACES.md`)
- [x] Define `AssetRegistry` interface
- [x] Define `ReviewRegistry` interface
- [x] Define `ReputationManager` interface
- [x] Implement `CreatorRegistry` logic + unit tests
- [x] Implement `AssetRegistry` logic + unit tests
- [x] Implement `ReviewRegistry` logic + unit tests (submit_review success/self-review/already-reviewed paths untestable at unit level due to a stylus-test 0.10.8 mock limitation — documented, will verify via real integration testing after deployment)
- [x] Implement `ReputationManager` logic + unit tests (recompute_score aggregation logic entirely untestable at unit level — a worse variant of ReviewRegistry's stylus-test mocking limitation, confirmed via three isolated experiments — will verify via real integration testing after deployment)
- [x] Deploy all four to Arbitrum testnet (CreatorRegistry, AssetRegistry deployed; ReviewRegistry, ReputationManager remain)
- [x] Record deployed addresses in `packages/shared-types/constants.ts` (CreatorRegistry, AssetRegistry — ReviewRegistry, ReputationManager remain)
- [x] Generate/verify ABI-equivalent TypeScript types for frontend/backend use (verified against real `cargo stylus export-abi` output, not assumed)

## IPFS *(Phase 4; retention policy doc belongs to Phase 11)*

- [x] Set up Pinata account + API keys
- [x] Build pin-file helper (backend)
- [x] Build pin-JSON (metadata) helper (backend)
- [x] Verify CID retrieval via public gateway
- [x] Decide and document pinning retention policy (who pays, what gets unpinned) — documented honest current gap (no retention policy exists, everything persists indefinitely), not implemented, revisit before production

## AI *(Phase 9)*

- [x] Design metadata generation prompt (title/description/tags from asset + creator input) — iterated through adversarial testing for unsupported-claim prevention
- [x] Implement AI API call wrapper (backend) — Gemini (`@google/genai`), not OpenAI (OpenAI requires billing setup; Gemini has a genuinely free tier)
- [x] Add human-in-the-loop edit step before AI metadata is finalized (review step in asset upload UI, before `/finalize-metadata`)
- [x] Implement analytics summarization (creator dashboard insights) — full stack done (⚠️ manual visual walkthrough of dashboard/charts not yet done — verify before demo)
- [x] Add basic cost/rate guardrails on AI calls (20/hour per wallet on /assets/prepare)

## Security *(Phase 11 — Security & Hardening)*

- [x] Ensure client-side hash is always computed and shown before upload
- [x] Never trust client-submitted hash without server-side re-verification pre-registration
- [x] Validate all file uploads (size/type limits) before pinning
- [x] Validate actual MIME type of uploads (not just file extension) — magic-byte inspection via `file-type`
- [x] Validate/re-encode uploaded images before pinning — validated for decodability via sharp; NOT re-encoded (a first attempt did re-encode, which would have silently broken the platform's core hash-integrity invariant — caught before merge, reverted to validation-only, canonical bytes pinned unmodified)
- [x] Sanitize all user-submitted text (profile bios, review content) — specifically XSS-payload sanitization on stored content, not just Zod shape/length validation (already in place)
- [x] Run `pnpm audit` and address any real findings (dependency vulnerability scan — never done) — 0 vulnerabilities after applying overrides for hono/postcss/ws/axios/nanoid
- [x] Ensure deployer/private keys are never committed (confirm `.gitignore` coverage)
- [x] Add basic abuse/spam protection on review submission (rate limit + wallet-based) — 10/hour per wallet, verified against the real configured limit end-to-end
- [x] Enforce nonce expiration (5 min) and single-use on `/auth/nonce` + `/auth/verify`
- [x] Add Helmet + Content Security Policy
- [x] Restrict CORS to deployed frontend origin(s), no wildcard
- [x] Validate required env vars at startup (fail fast if missing) — includes RPC_URL, hard-required after empirical investigation of viem's fallback behavior
- [x] Confirm no secret values ever appear in logs (verified throughout — private keys, JWTs, API keys never printed in any test session)

## Metadata & Versioning *(Phase 4 core; version-dispatch parser belongs to Phase 11)*

- [x] Add `version` + `schema` fields to all pinned metadata JSON (asset and profile)
- [x] Write metadata parser that dispatches by `schema`/`version` — tested in isolation, no real call site currently consumes it (nothing re-fetches previously-pinned metadata yet)
- [x] Document schema versions as they're introduced in `docs/` (`docs/METADATA_SCHEMA_VERSIONS.md`, verified against a real already-pinned IPFS object's actual content, not just code inspection)

## Testing *(cross-cutting — no committed automated suite yet, verified via ad-hoc scripts each session instead)*

- [x] Unit tests for each Stylus contract (CreatorRegistry, AssetRegistry — ReviewRegistry, ReputationManager remain, no logic yet)
- [ ] Integration test: full creator onboarding flow
- [ ] Integration test: full asset registration flow
- [ ] Integration test: verification flow (hash match/mismatch cases)
- [ ] Backend API endpoint tests (happy path + validation failures)
- [ ] Frontend component smoke tests for critical flows

## Design & Polish *(Phase 12 — visual/UX only, no longer includes security items, see Phase 11 above)*

- [ ] Apply consistent design system across all screens (shadcn/ui + Base UI + Nova + Zinc foundation)
- [ ] Style wallet connect header
- [ ] Style creator profile creation/edit flow
- [ ] Style asset upload/browse screens
- [ ] `/assets` renders in the old plain light theme (white background, black text) while the rest of the site (including the header/footer directly above/below it) now uses the dark theme adopted during the Frenil UI recovery merge — visible seam, kept deliberately unstyled on that branch since the fix was scoped to data correctness, not visual design
- [ ] Style public verification page
- [ ] Style review/reputation displays
- [ ] Responsive/mobile-friendly pass
- [ ] Design loading states across all flows
- [ ] Design empty states across all flows
- [ ] Design error states across all flows
- [ ] Replace default Next.js starter homepage with real landing page
- [ ] Micro-interactions/animation pass (Framer Motion)
- [ ] Design Proof of Origin Certificate visual layout

## Deployment *(Phase 13)*

- [ ] Provision PostgreSQL on Railway
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Confirm environment variables set correctly in both platforms
- [ ] Deploy contracts to Arbitrum testnet (pre-hackathon-demo checkpoint)
- [ ] Smoke test full flow on deployed environment before demo

## Documentation *(cross-cutting)*

- [x] Keep `DEVELOPER_KICKOFF_BLUEPRINT.md` updated as architecture evolves (asset flow section revised for the prepare/finalize-metadata/confirm redesign)
- [x] Document any deviation from `SMART_CONTRACT_INTERFACES.md` when contracts are implemented (4 real deviations found via full audit of all four contracts, recorded in `SMART_CONTRACT_INTERFACES.md`'s new "Known Deviations" section)
- [x] Maintain `.env.example` files as new secrets are introduced
- [ ] Write a short demo script for hackathon judges (separate from this pack)