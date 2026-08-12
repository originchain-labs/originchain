#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use alloc::vec::Vec;
use alloy_primitives::{Address, FixedBytes, U256, U64};
use alloy_sol_types::sol;
use stylus_sdk::prelude::*;

sol_storage! {
    #[entrypoint]
    pub struct ReputationManager {
        mapping(address => uint256) scores;
        mapping(address => uint64) last_computed;
    }
}

sol! {
    event ScoreUpdated(address indexed creator, uint256 new_score, uint64 timestamp);
}

sol_interface! {
    interface IAssetRegistry {
        function getAssetsByCreator(address creator) external view returns (bytes32[] memory);
    }

    interface IReviewRegistry {
        function getReviewCount(bytes32 asset_hash) external view returns (uint256);
    }
}

#[public]
impl ReputationManager {
    pub fn recompute_score(
        &mut self,
        creator: Address,
        asset_registry: Address,
        review_registry: Address,
    ) -> U256 {
        let asset_reg = IAssetRegistry::new(asset_registry);
        let asset_hashes: Vec<FixedBytes<32>> = asset_reg
            .get_assets_by_creator(self.vm(), Call::new(), creator)
            .unwrap_or_default();

        let asset_count = U256::from(asset_hashes.len());

        // Sum review counts across all this creator's assets. Each of
        // these is its OWN separate call (not chained within one another
        // the way ReviewRegistry's isRegistered->getAsset was) — worth
        // confirming during testing that N independent sequential calls
        // in a loop don't hit the same mock_static_call limitation, since
        // that bug was specifically about TWO DIFFERENT interfaces called
        // in sequence within one function, not N calls to the SAME
        // interface — these may behave differently in the test harness.
        let review_reg = IReviewRegistry::new(review_registry);
        let mut total_reviews = U256::from(0);
        for hash in &asset_hashes {
            let count = review_reg
                .get_review_count(self.vm(), Call::new(), *hash)
                .unwrap_or_default();
            total_reviews += count;
        }

        // Simple, transparent scoring formula: 10 points per registered
        // asset + 5 points per review received. Weighted toward assets
        // since that's the platform's core action; reviews are a signal
        // on top. Deliberately simple for hackathon speed — a more
        // sophisticated formula (weighted by rating, review recency, etc.)
        // is real future work, not needed for a working v1.
        let score = asset_count * U256::from(10) + total_reviews * U256::from(5);
        let timestamp = self.vm().block_timestamp();

        self.scores.setter(creator).set(score);
        self.last_computed.setter(creator).set(U64::from(timestamp));

        self.vm().log(ScoreUpdated {
            creator,
            new_score: score,
            timestamp,
        });

        score
    }

    pub fn get_score(&self, creator: Address) -> U256 {
        self.scores.get(creator)
    }

    pub fn get_last_computed(&self, creator: Address) -> u64 {
        self.last_computed.get(creator).to::<u64>()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use stylus_sdk::testing::*;

    #[test]
    fn test_get_score_zero_initially() {
        let vm = TestVM::default();
        let contract = ReputationManager::from(&vm);
        let creator = Address::from([9u8; 20]);
        assert_eq!(contract.get_score(creator), U256::from(0));
    }

    #[test]
    fn test_get_last_computed_zero_initially() {
        let vm = TestVM::default();
        let contract = ReputationManager::from(&vm);
        let creator = Address::from([9u8; 20]);
        assert_eq!(contract.get_last_computed(creator), 0u64);
    }

    // KNOWN GAP: recompute_score's aggregation logic (getAssetsByCreator once,
    // then getReviewCount once per asset in a loop) is NOT unit-testable
    // against stylus-test 0.10.8's TestVM, in any configuration — confirmed
    // by direct experiment, not assumed. This generalizes review-registry's
    // "two chained different-interface calls" finding (see its lib.rs and
    // contracts/README.md) to this contract's "one call, then N same-interface
    // calls" shape, and the result is worse here: it fails silently with
    // plausible-looking wrong data rather than a clean decode error.
    //
    // Root cause is the same shared `state.return_data` buffer traced in
    // review-registry: `mock_static_call` writes the mocked bytes into that
    // single buffer at *registration* time, and every dispatched call reads
    // back whatever is *currently* in it, regardless of which call actually
    // matched in the (to, calldata)-keyed map. Three experiments proved this
    // conclusively for this contract's specific shape:
    //
    //   1. Three DIFFERENT getReviewCount mocks (5, 3, 7) for three different
    //      hashes, called in sequence with nothing else mocked: all three
    //      calls returned 7 (the last-registered value), not their own. This
    //      is a *silent wrong result*, not a decode error — every call to
    //      getReviewCount returns a single uint256 (always exactly 32 bytes),
    //      so the wrong buffer still decodes "successfully," just with the
    //      wrong number.
    //   2. The theory that mocking the SAME value for every loop iteration
    //      would sidestep this (since a wrong-but-identical read is harmless)
    //      does NOT hold for the full recompute_score flow: with
    //      getAssetsByCreator mocked first and two identical getReviewCount
    //      mocks (2, 2) registered after it, recompute_score returned a score
    //      of 0, not the expected 2*10 + 4*5 = 40. getAssetsByCreator itself
    //      read back whichever getReviewCount mock was registered last (a
    //      uint256-shaped buffer far too short for a bytes32[] array),
    //      failed to decode, and `.unwrap_or_default()` silently produced an
    //      empty asset list — so the precursor call is corrupted by the
    //      *later* loop registrations, not just the loop calls corrupting
    //      each other. Reversing the registration order just moves the
    //      corruption from getAssetsByCreator onto every getReviewCount call
    //      instead (each would decode the array buffer's leading offset word
    //      as its count). No registration order makes both the precursor
    //      call and the loop read correctly at the same time, because there
    //      is exactly one shared buffer for the whole test.
    //   3. To rule out a mistake in the array-encoding helper rather than
    //      the shared-buffer bug: calling getAssetsByCreator with NOTHING
    //      else mocked decoded correctly (Ok([h1, h2])) — confirming the
    //      encoding itself is right, and isolating the failure above
    //      squarely to the shared-buffer limitation, not test-code error.
    //
    // Mitigation: same as review-registry — recompute_score's aggregation
    // logic needs real integration testing against the deployed contract
    // (a real AssetRegistry + ReviewRegistry + multiple real assets/reviews
    // on testnet), not unit tests with mocks.
}