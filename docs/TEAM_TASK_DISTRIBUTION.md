# OriginChain — Team Task Distribution

Assumes a team of 3 developers (matches OriginChain's actual team size), roles assigned by primary strength rather than rigid title, since all 3 will need to touch multiple layers at hackathon speed.

## Recommended Split

| Track | Primary Owner | Scope |
|---|---|---|
| **Contracts & Blockchain Integration** | Dev A | All 4 Stylus contracts, deployment, wallet-to-contract wiring, `shared-types/contracts` |
| **Backend & Data** | Dev B | Express API, Prisma/Postgres, indexer worker, IPFS integration, AI service wrapper |
| **Frontend & Product** | Dev C | All 16 screens, wallet UX, component library, client-side hashing UI |

This is a **primary-owner** model, not an exclusive-lane model — with 3 people, full isolation creates idle time whenever one track blocks another. Expect cross-track help, especially around Phase 3–4 integration points.

## Parallel Work Windows

These phases can be worked on simultaneously without blocking each other:

| Phase | Parallelizable? | Notes |
|---|---|---|
| Phase 0 (Foundation) | No | One person scaffolds, others review — fast, sequential |
| Phase 1 (Infrastructure) | **Yes** | Dev A sets up local Stylus env; Dev B sets up DB + IPFS; Dev C can start on static UI shells against Phase 0 scaffold |
| Phase 2 (Wallet Auth) | Partially | Dev C builds frontend wallet connect while Dev B builds `/auth` endpoints against a mocked signature — merge once both ready |
| Phase 3 (Creator Profiles) | **Yes**, after interfaces frozen | Dev A implements `CreatorRegistry` while Dev B builds the indexer against the interface (not the implementation) and Dev C builds the profile UI against `API_SPECIFICATION.md` mocks |
| Phase 4 (Asset Registration) | **Yes**, same pattern | Same three-way split: contract / indexer+API / UI, built against interfaces in parallel |
| Phase 5 (Verification) | Mostly Dev C + Dev B | Dev A largely free to start Phase 6 contracts early |
| Phase 6 (Reviews & Reputation) | **Yes** | Same three-way pattern |
| Phase 7 (AI Features) | Mostly Dev B, with Dev C for dashboard UI | Dev A can assist with testing/deployment prep |
| Phase 8 (Deployment) | No | Needs coordinated, sequential rollout |

## Key Principle: Build Against Interfaces, Not Implementations

The reason Phases 3, 4, and 6 can be parallelized despite touching contracts, backend, and frontend simultaneously: **`SMART_CONTRACT_INTERFACES.md` and `API_SPECIFICATION.md` are frozen before implementation starts.** Dev B and Dev C build against those documents (using mocks/stubs) while Dev A implements the real contract — integration is a wiring step at the end of each phase, not a blocking dependency throughout it.

## Merge Points

Explicit sync points where all 3 devs' work must integrate before moving forward:

1. **End of Phase 2:** Wallet auth frontend + backend must actually connect (not just individually work).
2. **End of Phase 3:** Deployed `CreatorRegistry` address must be wired into `shared-types/constants.ts`; indexer must be verified against the real deployed contract, not a stub.
3. **End of Phase 4:** Same wiring step for `AssetRegistry` — this is the highest-risk merge point, since it's the core product loop.
4. **End of Phase 6:** `ReviewRegistry` + `ReputationManager` wiring.
5. **Before Phase 8:** Full team smoke test of the complete local flow before anyone deploys.

## Integration Order

Matches the dependency graph in `DEVELOPMENT_ROADMAP.md`: contracts must be interface-frozen → backend/indexer built against interface → frontend built against API spec → three-way merge at each phase boundary. Never let frontend or backend implementation start against a contract interface that hasn't been reviewed by all 3 — a late interface change is the most expensive kind of rework at this team size.

## Responsibilities Beyond Code

| Responsibility | Owner |
|---|---|
| Keeping `docs/` updated as reality diverges from plan | Whoever causes the divergence, same PR |
| Demo script + hackathon presentation | Dev C (product/UI owner), reviewed by all |
| Deployment coordination (Phase 8) | Dev B (owns backend/infra familiarity) |
| Contract security review (self-review, no external audit at hackathon stage) | Dev A, cross-checked by Dev B |
