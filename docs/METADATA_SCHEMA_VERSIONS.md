# OriginChain — IPFS Metadata Schema Versions

This document lists every JSON metadata schema version currently constructed, pinned to IPFS, and dispatched in OriginChain.

---

## Registered Metadata Schemas

### 1. `originchain.profile.v1`

- **Schema Identifier**: `originchain.profile.v1`
- **Version Number**: `1`
- **Writing Endpoint**: `POST /api/v1/creators` (`createCreatorProfile` in `apps/backend/src/services/creator.service.ts`)
- **Parser Dispatch**: Handled in `apps/backend/src/utils/metadata-parser.ts` (`parseMetadata`)

#### Schema Definition

```json
{
  "version": 1,
  "schema": "originchain.profile.v1",
  "displayName": "Alice Creator",
  "bio": "Digital artist working with generative graphics.",
  "avatarCid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
}
```

#### Field Specifications

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | `number` | Yes | Numeric schema version (must be `1`). |
| `schema` | `string` | Yes | Literal string `"originchain.profile.v1"`. |
| `displayName` | `string` | Yes | Creator's public display name. |
| `bio` | `string` | Yes | Sanitized biography text (defaults to `""` if omitted). |
| `avatarCid` | `string` | Yes | IPFS CID of creator avatar image (defaults to `""` if omitted). |

---

### 2. `originchain.asset.v1`

- **Schema Identifier**: `originchain.asset.v1`
- **Version Number**: `1`
- **Writing Endpoint**: `POST /api/v1/assets/finalize-metadata` (`finalizeMetadata` in `apps/backend/src/services/asset.service.ts`)
- **Parser Dispatch**: Handled in `apps/backend/src/utils/metadata-parser.ts` (`parseMetadata`)

#### Schema Definition

```json
{
  "version": 1,
  "schema": "originchain.asset.v1",
  "title": "Sunset Horizon",
  "description": "Original high-resolution digital painting created on Arbitrum Sepolia.",
  "tags": ["digital-art", "landscape", "original"]
}
```

#### Field Specifications

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | `number` | Yes | Numeric schema version (must be `1`). |
| `schema` | `string` | Yes | Literal string `"originchain.asset.v1"`. |
| `title` | `string` | Yes | Human-readable title of the registered asset. |
| `description` | `string` | Yes | Detailed asset description (defaults to `""` if omitted). |
| `tags` | `string[]` | Yes | Array of tags for categorization and search. |

---

## Parser Compatibility

All pinned JSON payloads containing `version` and `schema` are dispatched by `apps/backend/src/utils/metadata-parser.ts`. Passing raw JSON with unrecognized schema strings or versions throws an explicit `UNSUPPORTED_METADATA_VERSION` error.
