# OriginChain — API Specification

Base path: `/api/v1`. All authenticated routes require a session token issued via wallet-signature auth (see Auth module below). Responses are JSON. Errors follow the shape:

```json
{ "error": { "code": "STRING_CODE", "message": "Human readable message" } }
```

---

## Auth

### `POST /auth/nonce`
- **Description:** Issue a nonce for the client to sign, proving wallet ownership.
- **Auth:** None
- **Request:** `{ "walletAddress": "0x..." }`
- **Response:** `{ "nonce": "string" }`
- **Errors:** `400 INVALID_ADDRESS`

### `POST /auth/verify`
- **Description:** Verify signed nonce, issue session token.
- **Auth:** None
- **Request:** `{ "walletAddress": "0x...", "signature": "0x..." }`
- **Response:** `{ "token": "jwt", "creator": { "id": "uuid", "walletAddress": "0x...", "isNewCreator": true } }`
- **Errors:** `401 INVALID_SIGNATURE`, `400 NONCE_EXPIRED`

---

## Creators

### `GET /creators/:id`
- **Description:** Fetch a public creator profile.
- **Auth:** None
- **Response:** `{ id, walletAddress, displayName, bio, avatarCid, organization, reputationScore }`
- **Errors:** `404 CREATOR_NOT_FOUND`

### `POST /creators`
- **Description:** Create a creator profile (post wallet auth).
- **Auth:** Required
- **Request:** `{ "displayName": "string", "bio": "string?", "avatarFile": "multipart" }`
- **Validation:** `displayName` 1–100 chars; `avatarFile` ≤ 5MB, image types only
- **Response:** `{ id, walletAddress, displayName, bio, avatarCid }`
- **Errors:** `400 VALIDATION_ERROR`, `409 PROFILE_ALREADY_EXISTS`

### `PATCH /creators/:id`
- **Description:** Update own profile.
- **Auth:** Required, must match `:id`
- **Request:** partial of `POST` body
- **Errors:** `403 FORBIDDEN`, `400 VALIDATION_ERROR`

### `GET /creators`
- **Description:** Search/browse creators.
- **Auth:** None
- **Request (query):** `?q=string&organizationId=uuid&page=1&limit=20`
- **Response:** `{ results: [...], page, total }`

---

## Assets

### `POST /assets/prepare`
- **Description:** Submit asset file + draft metadata for AI enrichment and IPFS pinning, prior to on-chain registration. Does not touch the blockchain.
- **Auth:** Required
- **Request:** `{ "file": "multipart", "title": "string?", "description": "string?" }`
- **Validation:** File ≤ 50MB
- **Response:** `{ "contentHash": "0x...", "ipfsCid": "string", "suggestedMetadata": { "title", "description", "tags": [] } }`
- **Errors:** `400 VALIDATION_ERROR`, `502 IPFS_PIN_FAILED`, `502 AI_SERVICE_FAILED` (degrades gracefully — returns without `suggestedMetadata` rather than failing the whole request)

### `POST /assets/finalize-metadata`
- **Description:** Pins the creator-approved final metadata (after reviewing/editing `/prepare`'s AI suggestions) to IPFS, returning the exact CID that must be used when signing `registerAsset` on-chain. **Must be called before the transaction is signed** — the blockchain and PostgreSQL must reference the identical metadata CID, so this step cannot be skipped or reordered after confirmation.
- **Auth:** Required
- **Request:** `{ "title": "string", "description": "string?", "tags": ["string"] }`
- **Response:** `{ "metadataCid": "string" }`
- **Errors:** `400 VALIDATION_ERROR`, `502 IPFS_PIN_FAILED`

### `POST /assets/confirm`
- **Description:** Called after on-chain registration succeeds. Verifies the transaction on-chain and persists the indexed record using the exact `ipfsCid`/`metadataCid` that were signed — never re-pins or recomputes metadata, since the blockchain is the source of truth for which CID was actually registered.
- **Auth:** Required
- **Request:** `{ "contentHash": "0x...", "ipfsCid": "string", "metadataCid": "string", "txHash": "0x...", "finalMetadata": { "title", "description", "tags": [] } }`
- **Response:** `{ asset: {...} }`
- **Errors:** `400 TX_NOT_FOUND_ON_CHAIN`, `409 ASSET_ALREADY_REGISTERED`

### `GET /assets/:id/certificate`
- **Description:** Returns the Proof of Origin Certificate for a registered asset (generated after `POST /assets/confirm` succeeds).
- **Auth:** None — the certificate is a public proof artifact, same trust model as the verification page
- **Response:** `{ certificateUrl: "string", qrCodeUrl: "string" }` — pre-rendered PDF/image URLs
- **Errors:** `404 CERTIFICATE_NOT_FOUND` (asset not yet registered or certificate generation failed — falls back gracefully, never blocks the core registration flow)

### `GET /assets/:id`
- **Description:** Fetch a single asset record.
- **Auth:** None
- **Response:** `{ id, creator, contentHash, ipfsCid, title, description, tags, registeredAt, txHash }`
- **Errors:** `404 ASSET_NOT_FOUND`

### `GET /assets`
- **Description:** Browse/search assets.
- **Auth:** None
- **Request (query):** `?q=string&creatorId=uuid&tag=string&page=1&limit=20`
- **Response:** `{ results: [...], page, total }`

### `GET /assets/verify`
- **Description:** Public verification lookup by hash — the core trust feature, must not require auth.
- **Auth:** None
- **Request (query):** `?hash=0x...`
- **Response:** `{ verified: true, asset: {...}, onChainTimestamp, creatorAddress }` or `{ verified: false }`
- **Errors:** `400 INVALID_HASH_FORMAT`

---

## Reviews

### `POST /reviews`
- **Description:** Submit a review for an asset (after on-chain review tx confirmed).
- **Auth:** Required
- **Request:** `{ "assetId": "uuid", "rating": 1-5, "comment": "string?", "txHash": "0x..." }`
- **Validation:** `rating` integer 1–5; one review per reviewer per asset
- **Errors:** `409 ALREADY_REVIEWED`, `400 VALIDATION_ERROR`, `400 TX_NOT_FOUND_ON_CHAIN`

### `GET /assets/:id/reviews`
- **Description:** List reviews for an asset.
- **Auth:** None
- **Request (query):** `?page=1&limit=20`
- **Response:** `{ results: [...], page, total, averageRating }`

---

## Reputation

### `GET /creators/:id/reputation`
- **Description:** Fetch cached reputation score and components.
- **Auth:** None
- **Response:** `{ creatorId, score, assetCount, reviewCount, lastUpdated }`

---

## Analytics

### `GET /creators/:id/analytics`
- **Description:** Creator-facing dashboard data (own profile only).
- **Auth:** Required, must match `:id`
- **Response:** `{ views: [...], verifications: [...], topAssets: [...], reviewTrend: [...] }`
- **Errors:** `403 FORBIDDEN`

### `GET /admin/analytics`
- **Description:** Platform-wide analytics for admin dashboard.
- **Auth:** Required, admin role
- **Response:** `{ totalCreators, totalAssets, totalVerifications, dailyActive: [...] }`
- **Errors:** `403 FORBIDDEN`

---

## Search

### `GET /search`
- **Description:** Unified search across creators, assets, and tags — powers the global search bar.
- **Auth:** None
- **Request (query):** `?q=string&type=creators|assets|tags|all&page=1&limit=20`
- **Response:** `{ creators: [...], assets: [...], tags: [...], page, total }` (only populated arrays for the requested `type`, or all three if `type=all`)
- **Errors:** `400 QUERY_TOO_SHORT` (minimum 2 characters)

---

## Health

### `GET /health`
- **Description:** Basic liveness/readiness check for uptime monitoring and deploy verification.
- **Auth:** None
- **Response:** `{ status: "ok", timestamp, dependencies: { database: "ok", storage: "ok" } }`
- **Notes:** Does not check blockchain connectivity (that's `/contracts` below) — keep this endpoint fast and cheap since it may be polled frequently by the hosting platform.

---

## Contract Status

### `GET /contracts`
- **Description:** Debugging/ops endpoint exposing the current on-chain configuration and indexer sync state.
- **Auth:** None (read-only, non-sensitive — all values are public on-chain anyway)
- **Response:**
```json
{
  "network": "arbitrum-sepolia",
  "contracts": {
    "creatorRegistry": "0x...",
    "assetRegistry": "0x...",
    "reviewRegistry": "0x...",
    "reputationManager": "0x..."
  },
  "latestIndexedBlock": 123456,
  "latestChainBlock": 123458,
  "syncStatus": "synced"
}
```
- **Notes:** `syncStatus` is `"synced"` when `latestChainBlock - latestIndexedBlock` is within a small tolerance, otherwise `"lagging"` — useful for quickly diagnosing "why isn't my registration showing up" during development and demos.

---

## Cross-Cutting Rules

- All list endpoints are paginated (`page`, `limit`, default `limit=20`, max `100`).
- All write endpoints that mirror an on-chain action (asset confirm, review submit) require the `txHash` and validate it against the chain before persisting — the API never accepts an unconfirmed claim as fact.
- Public endpoints (`verify`, `GET` on creators/assets/reviews, `search`) are rate-limited per-IP to prevent scraping abuse without requiring auth.
- All responses include standard security headers via Helmet; CORS is restricted to the deployed frontend origin(s), not wildcard.
- All requests are logged (method, path, status, latency) for debugging and demo-day troubleshooting; request bodies containing secrets or file contents are excluded from logs.
- `POST /assets/prepare` enforces upload size limits and validates actual file MIME type (not just extension) before accepting a file for pinning.
- `POST /auth/nonce` nonces expire after 5 minutes and are single-use — consumed and invalidated immediately upon successful `POST /auth/verify`, preventing replay.