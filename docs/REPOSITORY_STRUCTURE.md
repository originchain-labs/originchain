# OriginChain — Repository Structure

Full annotated monorepo layout.

```
originchain/
│
├── apps/
│   │
│   ├── frontend/                    # Next.js creator/visitor/org/admin app
│   │   ├── app/                     # App Router: routes for all 16 screens
│   │   │   ├── (public)/            # No-wallet-required routes (verify, browse, landing)
│   │   │   ├── (creator)/           # Creator-only authenticated routes
│   │   │   ├── (org)/               # Organization-role routes
│   │   │   └── (admin)/             # Admin routes
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui-based primitives
│   │   │   ├── wallet/              # Connect button, network guard, session state
│   │   │   ├── asset/               # Upload, hash preview, registration flow
│   │   │   ├── review/              # Review form, review list, rating display
│   │   │   └── analytics/           # Charts, dashboard widgets
│   │   ├── hooks/                   # Data/state hooks — see below for responsibilities
│   │   │   ├── useWallet.ts
│   │   │   ├── useCreator.ts
│   │   │   ├── useAsset.ts
│   │   │   ├── useReview.ts
│   │   │   └── useAnalytics.ts
│   │   ├── lib/
│   │   │   ├── api-client.ts        # Typed client using packages/shared-types
│   │   │   ├── hash.ts              # Client-side content hashing utility
│   │   │   └── wagmi-config.ts      # Chain/wallet configuration
│   │   ├── public/
│   │   ├── styles/
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── backend/                     # Express API + indexer worker
│       ├── src/
│       │   ├── routes/              # One file per resource — thin, delegates to controllers
│       │   ├── controllers/         # Request/response handling, calls services, no business logic itself
│       │   ├── validators/          # Input validation schemas (zod), one per resource — see below
│       │   ├── services/
│       │   │   ├── blockchain/      # Blockchain Service — sole owner of chain interaction
│       │   │   │   ├── contracts.ts       # Address + ABI registry
│       │   │   │   ├── tx-executor.ts     # Transaction execution, gas estimation, retries
│       │   │   │   ├── event-decoder.ts   # Decodes raw logs into typed events
│       │   │   │   └── errors.ts          # Translates chain errors into API error codes
│       │   │   ├── storage/         # Storage Service — sole owner of pinning/retrieval
│       │   │   │   ├── storage.interface.ts
│       │   │   │   └── providers/
│       │   │   │       └── pinata.provider.ts   # Current implementation; future providers added here
│       │   │   ├── ai/              # AI Provider Layer — see below
│       │   │   │   ├── provider/            # Provider interface + implementations (openai, future: claude, gemini, local)
│       │   │   │   ├── metadata/            # Metadata generation orchestration
│       │   │   │   ├── tags/                # Tag suggestion orchestration
│       │   │   │   ├── descriptions/        # Description generation orchestration
│       │   │   │   ├── analytics/           # AI-assisted analytics summaries
│       │   │   │   └── prompts/             # Centralized prompt templates
│       │   │   └── certificate/     # Proof of Origin Certificate generation (PDF/image + QR)
│       │   ├── indexer/             # Long-running worker: listens via Blockchain Service, writes to Postgres
│       │   ├── middleware/          # Auth, error handling, rate limiting, Helmet/CSP/CORS config
│       │   ├── prisma/
│       │   │   └── schema.prisma
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
│   │   │   ├── contracts/             # ABI-derived TS types
│   │   │   └── constants.ts           # Deployed contract addresses per network
│   │   └── package.json
│   │
│   └── config/                        # Shared tooling config
│       ├── tsconfig.base.json
│       ├── eslint-preset.js
│       └── prettier.config.js
│
├── docs/                               # This kickoff pack + evolving architecture docs
│   ├── DEVELOPER_KICKOFF_BLUEPRINT.md
│   ├── PROJECT_CHECKLIST.md
│   ├── REPOSITORY_STRUCTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_SPECIFICATION.md
│   ├── SMART_CONTRACT_INTERFACES.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── TEAM_TASK_DISTRIBUTION.md
│
├── scripts/                            # One-off / operational scripts
│   ├── deploy-contracts.sh
│   ├── seed-db.ts
│   └── sync-constants.ts               # Writes deployed addresses into shared-types/constants.ts
│
├── .github/                            # Reserved — issue templates/workflows added in next phase
│
├── .gitignore
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
| `services/blockchain/` as a dedicated layer | Isolates all contract-address/ABI/gas/retry/event-decoding concerns from route handlers — route code should never `import` a contract ABI directly |
| `services/storage/` with a `providers/` subfolder | The backend depends on `storage.interface.ts`, never on Pinata directly — swapping or adding a provider later touches only the `providers/` folder |
| `services/ai/` split by concern (`provider/`, `metadata/`, `tags/`, etc.) | `provider/` isolates which LLM vendor is called; the other folders contain orchestration logic that stays identical regardless of provider — this is what makes switching OpenAI → Claude/Gemini/local a config change, not a rewrite |
| `controllers/` + `validators/` added between `routes/` and `services/` | Keeps `routes/` as pure route-to-handler wiring, `validators/` as pure input-shape enforcement (rejects bad requests before any business logic runs), and `controllers/` as the thin glue — each layer has exactly one job and is independently testable |
| `hooks/` in frontend | Centralizes data-fetching and wallet-state logic so components stay presentational — see responsibilities below |

## Frontend Hooks Responsibilities

| Hook | Responsibility |
|---|---|
| `useWallet` | Wraps Wagmi connection state, exposes connect/disconnect, current address, chain-mismatch warnings |
| `useCreator` | Fetches/mutates the current or a specified creator profile via `api-client` |
| `useAsset` | Handles the upload → hash → AI-suggest → pin → register flow state machine |
| `useReview` | Submits and lists reviews for an asset |
| `useAnalytics` | Fetches creator or admin analytics data for dashboard components |

Components consume these hooks and stay focused on rendering — no direct `fetch`/`api-client` calls inside JSX-heavy component files.

## Backend Validators Responsibility

Each resource (`creators`, `assets`, `reviews`, `auth`) gets a matching file in `validators/` defining its request schemas (zod). Validators run in `middleware/` **before** a request reaches its controller — malformed requests are rejected with `400 VALIDATION_ERROR` before any service, database, or blockchain call happens. This keeps validation rules in one auditable place per resource, matching the request/response shapes documented in `API_SPECIFICATION.md`.
