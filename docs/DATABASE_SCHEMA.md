# OriginChain — Database Schema (PostgreSQL)

PostgreSQL here is an **index and cache layer**, not the source of truth. Every table that mirrors on-chain data includes the on-chain identifier it was derived from, so state can always be reconciled by replaying contract events.

**Last reconciled against real `prisma/schema.prisma`: August 2026.**

> [!NOTE]
> Several tables documented in the original kickoff schema were never implemented. These are clearly labeled below as **"Planned, Not Implemented"** and kept for future-scope reference rather than removed. Where the real schema diverged from the original plan (different field names, merged tables, nullable vs. not-null), the real implementation is the authoritative version.

## Entity-Relationship Diagram

> [!NOTE]
> The ERD reflects the **implemented** schema only. Planned-but-unimplemented tables (REPUTATION_SCORES, TAGS, ASSET_TAGS, ANALYTICS_EVENTS) are documented separately in the Table Definitions section below.

```mermaid
erDiagram
    CREATORS ||--o{ ASSETS : owns
    CREATORS ||--o{ REVIEWS : writes
    ASSETS ||--o{ REVIEWS : receives
    ORGANIZATIONS ||--o{ CREATORS : employs
    CREATORS }o--|| ORGANIZATIONS : owned_by

    CREATORS {
        uuid id PK
        varchar_42 wallet_address UK
        varchar_100 display_name
        text bio
        varchar_100 avatar_cid
        uuid organization_id FK
        boolean on_chain_confirmed
        varchar_66 registration_tx_hash
        timestamptz created_at
        int reputation_score
        timestamptz reputation_updated_at
    }
    ASSETS {
        uuid id PK
        uuid creator_id FK
        varchar_66 content_hash UK
        varchar_100 ipfs_cid
        varchar_100 metadata_cid
        varchar_200 title
        text description
        boolean ai_generated_flag
        timestamptz registered_at
        varchar_66 tx_hash
        boolean on_chain_confirmed
        varchar_100 certificate_cid
        varchar_20 proof_id UK
    }
    REVIEWS {
        uuid id PK
        uuid asset_id FK
        uuid reviewer_id FK
        int rating
        text comment
        varchar_66 tx_hash
        timestamptz created_at
    }
    ORGANIZATIONS {
        uuid id PK
        varchar_150 name
        uuid owner_id FK_UK
        varchar_42 wallet_address UK
        timestamptz created_at
    }
    INDEXER_STATE {
        uuid id PK
        varchar_100 indexer_name UK
        bigint last_block
        timestamptz updated_at
    }
```

## Table Definitions

### `creators`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| wallet_address | varchar(42) | unique, not null, indexed |
| display_name | varchar(100) | not null |
| bio | text | nullable |
| avatar_cid | varchar(100) | nullable — IPFS CID |
| organization_id | uuid | FK → organizations.id, nullable |
| on_chain_confirmed | boolean | not null, default false |
| registration_tx_hash | varchar(66) | nullable — set after on-chain confirmation |
| created_at | timestamptz | not null, default now() |
| reputation_score | integer | not null, default 0 |
| reputation_updated_at | timestamptz | nullable — null until first reputation compute |

Indexed on `wallet_address` (primary lookup path for auth and profile pages).

> [!NOTE]
> The original kickoff schema documented a separate `REPUTATION_SCORES` table (`creator_id PK/FK`, `score`, `asset_count`, `review_count`, `last_updated`). This was **merged into the `creators` table** as `reputation_score` and `reputation_updated_at` inline fields. Rationale: reputation is a single computed integer per creator with no sub-components that need independent querying at current scale — a separate table with a mandatory FK join on every creator read added complexity without benefit. The `asset_count` and `review_count` breakdown fields from the kickoff doc were dropped because the actual `ReputationManager` contract returns a single aggregated score, making separate count caches a denormalization that could drift from on-chain truth.

### `assets`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| creator_id | uuid | FK → creators.id, not null, indexed |
| content_hash | varchar(66) | unique, not null — the verifiable proof-of-origin hash |
| ipfs_cid | varchar(100) | not null — points to the pinned asset file |
| metadata_cid | varchar(100) | not null — points to pinned metadata JSON |
| title | varchar(200) | not null |
| description | text | nullable |
| ai_generated_flag | boolean | default false — true if metadata originated from AI suggestion |
| registered_at | timestamptz | **nullable** — set after on-chain confirmation |
| tx_hash | varchar(66) | **nullable** — set after on-chain confirmation |
| on_chain_confirmed | boolean | not null, default false |
| certificate_cid | varchar(100) | nullable — IPFS CID of generated Proof of Origin Certificate |
| proof_id | varchar(20) | unique, nullable — short human-readable proof identifier |

Indexed on `content_hash` (verification lookups) and `creator_id` (portfolio pages).

> [!NOTE]
> Deviations from kickoff schema: (1) `registered_at` and `tx_hash` are **nullable** in the real schema — they are absent when an asset record is created pre-confirmation and filled in once the on-chain transaction confirms. The kickoff doc incorrectly marked them `not null`. (2) `on_chain_confirmed`, `certificate_cid`, and `proof_id` are new fields not in the original plan, added during implementation to track confirmation state and support the Proof of Origin Certificate feature.

### `reviews`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| asset_id | uuid | FK → assets.id, not null, indexed |
| reviewer_id | uuid | FK → creators.id, not null |
| rating | integer | not null |
| comment | text | nullable |
| tx_hash | varchar(66) | not null |
| created_at | timestamptz | not null, default now() |

Unique constraint on `(asset_id, reviewer_id)` — one review per reviewer per asset, mirroring the anti-sybil rule enforced on-chain in `ReviewRegistry`.

> [!NOTE]
> The kickoff doc used `reviewer_creator_id` as the FK column name; the real schema uses `reviewer_id` (the Prisma field is `reviewerId`). The kickoff doc specified `rating` as `smallint` with a `check (rating between 1 and 5)` constraint — the real schema uses plain `Int` (no DB-level check constraint; rating validation is enforced by the `ReviewRegistry` contract on-chain, specifically via an explicit `InvalidRating` error).

### `organizations`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| name | varchar(150) | not null |
| owner_id | uuid | FK → creators.id, unique, not null |
| wallet_address | varchar(42) | unique, nullable |
| created_at | timestamptz | not null, default now() |

> [!NOTE]
> The kickoff schema was missing the `owner_id` FK column entirely. The real schema has a 1:1 relationship between `Organization` and the owning `Creator` (`ownerId String @unique`).

### `indexer_state`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| indexer_name | varchar(100) | unique, not null — e.g. `creator-registry-indexer` |
| last_block | bigint | not null — last successfully indexed chain block |
| updated_at | timestamptz | not null, auto-updated on every write |

This table was not in the kickoff schema. It tracks incremental indexer progress for both `creator-registry-indexer` and `asset-registry-indexer`, enabling crash-safe resumption without re-scanning from the deployment block.

## Prisma Model Naming Convention

All five models follow the same pattern: Prisma model name is PascalCase singular, actual Postgres table name is snake_case plural (enforced via `@@map`):

| Prisma Model | Postgres Table | `@@map` present |
|---|---|---|
| `Creator` | `creators` | ✅ |
| `Asset` | `assets` | ✅ |
| `Review` | `reviews` | ✅ |
| `Organization` | `organizations` | ✅ |
| `IndexerState` | `indexer_state` | ✅ |

The kickoff doc used raw Postgres table names (plural) throughout, which is correct — the Prisma model names (singular) are a Prisma convention and don't affect the actual table names in the database.

---

## Planned, Not Implemented

These were documented in the original kickoff schema but were **never built**. They represent genuine future-scope ideas, preserved here as documented intent. No migration exists for any of them.

### `reputation_scores` *(merged into `creators`)*
Originally planned as a standalone table (`creator_id PK/FK`, `score`, `asset_count`, `review_count`, `last_updated`). Merged into the `creators` table as inline fields during implementation — see note under `creators` above for rationale.

### `tags` / `asset_tags` *(not implemented)*
Standard many-to-many tagging system. `tags.source` would distinguish `'ai'` vs `'creator'` origin for visual flagging. Tag suggestion is generated by the AI layer but the suggested tags are written directly into the asset's pinned metadata JSON — they are not stored as relational rows in Postgres. A dedicated tags table would be needed if searching/filtering by tag becomes a product requirement. **Unresolved gap — no decision made.**

### `analytics_events` *(not implemented)*
Planned as an append-only event log (`creator_id FK`, `event_type`, `metadata jsonb`, `occurred_at`) powering page-view and verification-attempt analytics. No page-view or verification-attempt tracking was ever built. The admin analytics feature uses on-chain event counts (`getLogs`) rather than off-chain event logging. **Unresolved gap — no decision made.**

---

## Future-Ready Tables (Not Implemented Now)

### `notifications`
Purpose: in-app/email notifications (e.g. "your asset was reviewed," "verification milestone reached"). Would need `creator_id`, `type`, `payload jsonb`, `read_at`, `created_at`. Deferred until there's an actual delivery mechanism (email service or in-app inbox) to justify it.

### `verification_logs`
Purpose: audit trail of every public verification attempt (`GET /assets/verify` calls) — useful later for analytics ("this asset has been verified 500 times") and abuse detection. Would need `content_hash`, `matched boolean`, `ip_hash`, `occurred_at`. Deferred because on-chain getLogs can satisfy this need in the short term; a dedicated table is only worth it once verification volume is high enough to need different retention/indexing.

### `audit_logs`
Purpose: administrative action trail (profile edits by admins, disputes resolved, manual data corrections) — important once the platform has real users and needs accountability for privileged actions. Would need `actor_id`, `action`, `target_type`, `target_id`, `diff jsonb`, `created_at`. Deferred until admin tooling beyond basic dashboards exists.

---

## Design Notes

- All foreign keys use `uuid`, not the wallet address, so internal relationships survive a creator changing their linked wallet in the future (a real product need, not just theory).
- `content_hash` uniqueness at the database level is a defense-in-depth check — the actual duplicate-prevention rule is enforced on-chain in `AssetRegistry`, but blocking here avoids a wasted indexer write on an impossible state.
- No cascading deletes on creator/asset relationships — proof-of-origin records should never be destructible, even off-chain. Use soft-delete flags if hiding content is ever needed.
- `assets.metadata_cid` points to a versioned JSON document (see `METADATA_SCHEMA_VERSIONS.md`). Postgres does not need its own `schema_version` column today — the version lives in the pinned JSON itself — but if metadata parsing logic ever needs to branch based on version without re-fetching from IPFS, a `metadata_version smallint` column can be added to `assets` as a cache of that same value.
