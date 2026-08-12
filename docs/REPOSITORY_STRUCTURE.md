# OriginChain — Repository Structure

Full annotated monorepo layout. **Last reconciled against real implementation: August 2026.**

> [!NOTE]
> This document was originally written at project kickoff and has been updated to match the actual implemented structure. Where the implementation diverged from the original plan for a deliberate engineering reason, the rationale is noted inline.

```
originchain/
│
├── apps/
│   │
│   ├── frontend/                    # Next.js creator/visitor/admin app
│   │   ├── app/                     # App Router
│   │   │   ├── (public)/            # No-wallet-required routes
│   │   │   │   ├── assets/          # Browse all assets; [id]/ for asset detail page
│   │   │   │   ├── creators/        # Browse creators; [id]/ for public creator profile
│   │   │   │   ├── search/          # Global search results page
│   │   │   │   └── verify/          # Verification tool; [proofId]/ for certificate verify
│   │   │   ├── (creator)/           # Creator authenticated route group
│   │   │   │   ├── dashboard/       # Creator dashboard
│   │   │   │   ├── profile/         # Profile management: create/, edit/ sub-routes
│   │   │   │   └── assets/          # Asset management: upload/ sub-route
│   │   │   ├── (org)/               # Organization-role route group
│   │   │   │   └── dashboard/       # Organization dashboard page (/org/dashboard -> /dashboard)
│   │   │   └── (admin)/             # Admin route group
│   │   │       └── page.tsx         # Admin analytics page
│   │   │
│   │   │   Note: Route groups (creator), (org), and (admin) are top-level siblings
│   │   │   under app/. Each route uses RequireAuth per-page for authentication gating.
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui-based primitives (button.tsx)
│   │   │   ├── auth/                # Auth guards (RequireAuth.tsx)
│   │   │   ├── asset/               # Asset-related components (ReviewSection.tsx)
│   │   │   ├── creator/             # Creator-specific components (ReputationBadge.tsx)
│   │   │   ├── charts/              # Chart system (visx-based, many files)
│   │   │   ├── layout/              # Shared layout components (header.tsx, footer.tsx)
│   │   │   └── shimmering-text.tsx  # Standalone animated text utility component
│   │   │
│   │   │   Note: Original plan listed wallet/, review/, analytics/ subfolders.
│   │   │   Reality: wallet connect UI is handled inline via RainbowKit/wagmi (no
│   │   │   separate folder needed); review components live in asset/; chart/analytics
│   │   │   components live in charts/; auth guards are in auth/; creator-specific
│   │   │   components are in creator/.
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Wallet auth state: session, connect, sign-in flow
│   │   │   ├── useCreatorProfile.ts # Fetch/mutate creator profile via api-client
│   │   │   ├── useAsset.ts          # Upload → hash → AI-suggest → pin → register flow
│   │   │   ├── useReview.ts         # Submit and list reviews for an asset
│   │   │   ├── useAnalytics.ts      # Fetch creator analytics data for dashboard
│   │   │   ├── useOrganization.ts   # Fetch/create/update organization state
│   │   │   ├── useAdmin.ts          # Fetch admin analytics data (null-for-403 handling)
│   │   │   └── useReputation.ts     # Fetch creator reputation score & breakdown
│   │   │
│   │   │   Note: Certificate fetching remains direct Server Component data fetching
│   │   │   in app/(public)/assets/[id]/page.tsx (an async RSC) to maintain SSR/SEO.
│   │   │
│   │   ├── lib/
│   │   │   ├── api-client.ts        # Typed client using packages/shared-types
│   │   │   ├── hash.ts              # Client-side content hashing utility
│   │   │   ├── wagmi-config.ts      # Chain/wallet configuration
│   │   │   ├── session.ts           # Session state helpers (token read/write)
│   │   │   ├── utils.ts             # Shared utility functions (cn/classnames)
│   │   │   └── x402-empty-stub.ts   # Stub for x402 payment protocol (future scope)
│   │   ├── public/
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── backend/                     # Express API + indexer worker
│       ├── prisma/
│       │   ├── schema.prisma        # Prisma schema — source of truth for DB shape
│       │   └── seed.ts              # Dev database seed script (pnpm prisma db seed)
│       ├── src/
│       │   ├── routes/              # One file per resource — thin, delegates to controllers
│       │   │   ├── asset.routes.ts
│       │   │   ├── auth.routes.ts
│       │   │   ├── creator.routes.ts
│       │   │   ├── admin.routes.ts
│       │   │   ├── organization.routes.ts
│       │   │   ├── review.routes.ts
│       │   │   ├── search.routes.ts
│       │   │   └── ops.routes.ts    # GET /health, GET /contracts operational endpoints
│       │   ├── controllers/         # Request/response handling, calls services, no business logic itself
│       │   ├── validators/          # Input validation schemas (zod), one per resource — see below
│       │   ├── config/
│       │   │   └── env-validator.ts # Fail-fast env var presence check at startup
│       │   ├── utils/
│       │   │   ├── metadata-parser.ts   # Version-dispatch parser for pinned metadata JSON
│       │   │   ├── sanitizer.ts         # Input sanitization helpers
│       │   │   └── upload-validator.ts  # MIME/file content validation before pinning
│       │   ├── services/
│       │   │   ├── blockchain/      # Blockchain Service — sole owner of chain interaction
│       │   │   │   ├── registry.ts        # Single shared chainClient + contract address/ABI bundle
│       │   │   │   ├── read.ts            # readContract, getBlockNumber, getTransaction(Receipt) with retries
│       │   │   │   ├── events.ts          # getLogs with chunked range splitting (100k–1M block chunks)
│       │   │   │   └── errors.ts          # Translates chain errors into API error codes
│       │   │   │
│       │   │   │   Note: Original plan listed contracts.ts, tx-executor.ts, event-decoder.ts,
│       │   │   │   errors.ts. Reality: contracts.ts → registry.ts (holds both addresses and
│       │   │   │   chainClient); tx-executor.ts was never built (backend is read-only — all
│       │   │   │   writes are signed/broadcast from the frontend via wagmi); event-decoder.ts
│       │   │   │   → events.ts (chunked getLogs, not a raw log decoder).
│       │   │   │
│       │   │   ├── storage/         # Storage Service — sole owner of pinning/retrieval
│       │   │   │   ├── storage.interface.ts
│       │   │   │   ├── index.ts
│       │   │   │   └── providers/
│       │   │   │       └── pinata.provider.ts
│       │   │   ├── ai/              # AI Provider Layer
│       │   │   │   └── gemini.provider.ts  # Single Gemini provider (metadata generation)
│       │   │   │
│       │   │   │   Note: Original plan showed a subfolder abstraction (provider/,
│       │   │   │   metadata/, tags/, descriptions/, analytics/, prompts/). Reality:
│       │   │   │   a single flat gemini.provider.ts file. The multi-subfolder structure
│       │   │   │   was designed for multi-provider + per-concern orchestration; at one
│       │   │   │   provider (Gemini) and one concern (metadata generation), the extra
│       │   │   │   directories would be empty scaffolding with no benefit.
│       │   │   │
│       │   │   ├── auth/            # Auth service layer
│       │   │   │   ├── auth.service.ts
│       │   │   │   └── nonce-store.ts
│       │   │   ├── certificate/     # Proof of Origin Certificate generation (PDF + QR)
│       │   │   │   └── certificate.service.ts
│       │   │   ├── asset.service.ts
│       │   │   ├── creator.service.ts
│       │   │   ├── organization.service.ts
│       │   │   ├── review.service.ts
│       │   │   └── search.service.ts
│       │   ├── indexer/             # Long-running workers: poll chain, write to Postgres
│       │   │   ├── creator-indexer.ts
│       │   │   └── asset-indexer.ts
│       │   ├── middleware/          # Auth, error handling, rate limiting, CORS config
│       │   │   ├── auth.ts
│       │   │   ├── adminAuth.ts
│       │   │   ├── errorHandler.ts
│       │   │   ├── rateLimit.ts
│       │   │   └── validate.ts
│       │   └── index.ts
│       ├── .env.example
│       └── package.json
│
├── contracts/                       # Cargo workspace — one crate per registry
│   ├── Cargo.toml                   # Workspace manifest
│   ├── creator-registry/
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── asset-registry/
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── review-registry/
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── reputation-manager/
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   └── .env.example                 # RPC URL, deployer key (test wallet only)
│
├── packages/
│   ├── shared-types/                 # Single source of truth for cross-app types
│   │   ├── src/
│   │   │   ├── api/                  # Request/response types matching API_SPECIFICATION.md
│   │   │   │                         # ⚠ Currently an empty placeholder — no files present.
│   │   │   │                         #   lib/api-client.ts defines its own inline TypeScript
│   │   │   │                         #   types per-function rather than importing from here.
│   │   │   │                         #   A dedicated shared api/ types module was planned but
│   │   │   │                         #   deferred; the inline approach was used instead to
│   │   │   │                         #   avoid import-cycle risk before the types stabilized.
│   │   │   ├── contracts/             # ABI-derived TS types
│   │   │   ├── constants.ts           # Deployed contract addresses per network
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                        # Shared tooling config
│       ├── tsconfig.base.json
│       ├── eslint-preset.js
│       └── prettier.config.js
│
├── docs/                               # Architecture docs, reconciled per-session
│   ├── DEVELOPER_KICKOFF_BLUEPRINT.md
│   ├── PROJECT_CHECKLIST.md
│   ├── REPOSITORY_STRUCTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_SPECIFICATION.md
│   ├── SMART_CONTRACT_INTERFACES.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── METADATA_SCHEMA_VERSIONS.md    # Added during Phase 11 — pinned metadata schema spec
│   └── TEAM_TASK_DISTRIBUTION.md
│
├── scripts/                            # One-off / operational scripts
│   └── (currently empty — .gitkeep)
│
│   Note: Original plan listed deploy-contracts.sh, seed-db.ts, sync-constants.ts here.
│   Reality: the seed script lives at apps/backend/prisma/seed.ts (Prisma convention,
│   invoked via `pnpm prisma db seed`); deploy and sync-constants scripts were never
│   written (deployment happened manually via cargo deploy / direct RPC calls during
│   the hackathon build; contract addresses were updated in shared-types/constants.ts
│   directly). These could be backfilled as real operational needs arise.
│
├── .github/                            # Reserved — currently empty
│
├── .gitignore
├── pnpm-workspace.yaml                 # pnpm workspace manifest (apps/*, packages/*)
├── package.json                        # Root workspace manifest
└── README.md
```

## Why this structure

| Decision | Rationale |
|---|---|
| `apps/` vs. flat `frontend/` + `backend/` | Leaves room to add a future `apps/admin-console` or `apps/mobile` without restructuring |
| Cargo workspace under `contracts/` separate from JS workspace | Rust and Node tooling don't mix well in one workspace manifest; keeping them siblings avoids build tool conflicts |
| `packages/shared-types` | Prevents frontend/backend type drift — a single place defines what an "Asset" or "Creator" object looks like |
| Indexer lives inside `apps/backend/src/indexer`, not a separate app | At 3 people and hackathon scope, a separate deployable indexer service is premature; keep it as a worker process spawned by the backend for now, split out later if load requires it |
| `.github/` reserved but empty | Explicitly out of scope for this phase per project plan — placeholder only |
| `services/blockchain/` as a dedicated layer | Isolates all contract-address/ABI/retry/event-decoding concerns from route handlers — route code should never `import` a contract ABI directly. Backend is read-only (all writes are signed/broadcast from the frontend via wagmi), so no tx-executor was needed. |
| `services/storage/` with a `providers/` subfolder | The backend depends on `storage.interface.ts`, never on Pinata directly — swapping or adding a second pinning provider later touches only the `providers/` folder |
| `services/ai/` as a single flat file (not the planned multi-subfolder abstraction) | With one AI provider (Gemini) and one concern (asset metadata generation), the planned `provider/`, `metadata/`, `tags/`, etc. subdirectories would all be near-empty. The interface boundary is still clean — all AI calls go through `gemini.provider.ts` — and can be refactored into the full subfolder structure if a second provider or concern is added. |
| `controllers/` + `validators/` added between `routes/` and `services/` | Keeps `routes/` as pure route-to-handler wiring, `validators/` as pure input-shape enforcement (rejects bad requests before any business logic runs), and `controllers/` as the thin glue — each layer has exactly one job and is independently testable |
| `hooks/` in frontend | Centralizes data-fetching and wallet-state logic so components stay presentational — see responsibilities below |

## Frontend Hooks Responsibilities

| Hook | Responsibility | Note |
|---|---|---|
| `useAuth` | Wallet auth state, session token, SIWE sign-in/sign-out flow | Originally planned as `useWallet` — renamed to better reflect that it manages auth session state, not just wallet connection (RainbowKit/wagmi handle the raw connect UX directly) |
| `useCreatorProfile` | Fetches/mutates the current or a specified creator profile via `api-client` | Originally planned as `useCreator` — renamed for clarity |
| `useAsset` | Handles the upload → hash → AI-suggest → pin → register flow state machine | — |
| `useReview` | Submits and lists reviews for an asset | — |
| `useAnalytics` | Fetches creator or admin analytics data for dashboard components | — |

Organization, admin analytics, reputation, and certificate data are fetched directly in their respective page components via `api-client` — each is used in exactly one screen, making a dedicated hook an unnecessary abstraction at current scale.

## Backend Validators Responsibility

Each resource (`creators`, `assets`, `reviews`, `auth`) gets a matching file in `validators/` defining its request schemas (zod). Validators run in `middleware/` **before** a request reaches its controller — malformed requests are rejected with `400 VALIDATION_ERROR` before any service, database, or blockchain call happens. This keeps validation rules in one auditable place per resource, matching the request/response shapes documented in `API_SPECIFICATION.md`.
