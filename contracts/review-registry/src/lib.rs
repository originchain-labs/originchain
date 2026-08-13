#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use alloc::string::String;
use alloy_primitives::{Address, FixedBytes, U64, U8};
use alloy_sol_types::sol;
use stylus_sdk::prelude::*;

sol_storage! {
    #[entrypoint]
    pub struct ReviewRegistry {
        mapping(bytes32 => mapping(address => Review)) reviews;
        mapping(bytes32 => uint256) review_count;
    }

    pub struct Review {
        uint8 rating;
        string comment_cid;
        uint64 timestamp;
        bool exists;
    }
}

sol! {
    event ReviewSubmitted(bytes32 indexed asset_hash, address indexed reviewer, uint8 rating, uint64 timestamp);

    error AlreadyReviewed();
    error SelfReviewNotAllowed();
    error ReviewerNotRegistered();
    error AssetNotFound();
    error InvalidRating();
}

#[derive(SolidityError)]
pub enum ReviewRegistryError {
    AlreadyReviewed(AlreadyReviewed),
    SelfReviewNotAllowed(SelfReviewNotAllowed),
    ReviewerNotRegistered(ReviewerNotRegistered),
    AssetNotFound(AssetNotFound),
    InvalidRating(InvalidRating),
}

sol_interface! {
    interface ICreatorRegistry {
        function isRegistered(address creator) external view returns (bool);
    }

    interface IAssetRegistry {
        function getAsset(bytes32 hash) external view returns (address, string memory, string memory, uint64, bool);
    }
}

#[public]
impl ReviewRegistry {
    pub fn submit_review(
        &mut self,
        asset_hash: FixedBytes<32>,
        rating: u8,
        comment_cid: String,
        creator_registry: Address,
        asset_registry: Address,
    ) -> Result<(), ReviewRegistryError> {
        if rating < 1 || rating > 5 {
            return Err(ReviewRegistryError::InvalidRating(InvalidRating {}));
        }

        let caller = self.vm().msg_sender();
        let timestamp = U64::from(self.vm().block_timestamp());

        let creator_reg = ICreatorRegistry::new(creator_registry);
        let is_registered = creator_reg
            .is_registered(self.vm(), Call::new(), caller)
            .map_err(|_| ReviewRegistryError::ReviewerNotRegistered(ReviewerNotRegistered {}))?;
        if !is_registered {
            return Err(ReviewRegistryError::ReviewerNotRegistered(ReviewerNotRegistered {}));
        }

        let asset_reg = IAssetRegistry::new(asset_registry);
        let (asset_creator, _, _, _, asset_exists) = asset_reg
            .get_asset(self.vm(), Call::new(), asset_hash)
            .map_err(|_| ReviewRegistryError::AssetNotFound(AssetNotFound {}))?;
        if !asset_exists {
            return Err(ReviewRegistryError::AssetNotFound(AssetNotFound {}));
        }
        if asset_creator == caller {
            return Err(ReviewRegistryError::SelfReviewNotAllowed(SelfReviewNotAllowed {}));
        }

        let mut asset_reviews = self.reviews.setter(asset_hash);
        let mut review = asset_reviews.setter(caller);
        if review.exists.get() {
            return Err(ReviewRegistryError::AlreadyReviewed(AlreadyReviewed {}));
        }

        review.rating.set(U8::from(rating));
        review.comment_cid.set_str(&comment_cid);
        review.timestamp.set(timestamp);
        review.exists.set(true);

        let count = self.review_count.get(asset_hash) + alloy_primitives::U256::from(1);
        self.review_count.setter(asset_hash).set(count);

        self.vm().log(ReviewSubmitted {
            asset_hash,
            reviewer: caller,
            rating,
            timestamp: timestamp.to::<u64>(),
        });

        Ok(())
    }

    pub fn get_review(&self, asset_hash: FixedBytes<32>, reviewer: Address) -> (u8, String, u64, bool) {
        let asset_reviews = self.reviews.get(asset_hash);
        let review = asset_reviews.get(reviewer);
        (
            review.rating.get().to::<u8>(),
            review.comment_cid.get_string(),
            review.timestamp.get().to::<u64>(),
            review.exists.get(),
        )
    }

    pub fn get_review_count(&self, asset_hash: FixedBytes<32>) -> alloy_primitives::U256 {
        self.review_count.get(asset_hash)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use alloy_sol_types::{sol_data, SolType};
    use stylus_sdk::testing::*;

    #[test]
    fn test_get_review_count_zero_initially() {
        let vm = TestVM::default();
        let contract = ReviewRegistry::from(&vm);
        let hash = FixedBytes::from([1u8; 32]);
        assert_eq!(contract.get_review_count(hash), alloy_primitives::U256::from(0));
    }

    #[test]
    fn test_get_review_returns_default_for_no_review() {
        let vm = TestVM::default();
        let contract = ReviewRegistry::from(&vm);
        let hash = FixedBytes::from([1u8; 32]);
        let (_, _, _, exists) = contract.get_review(hash, vm.msg_sender());
        assert!(!exists);
    }

    // Calldata/return-data encoding for `mock_static_call` must exactly match what the
    // `sol_interface!`-generated methods construct: selector = keccak256(canonical
    // signature)[..4], args encoded via `abi_encode_params` over the sol_data param
    // tuple, return decoded via `abi_decode_params_validate` (multi-value returns
    // decode directly as the N-tuple, not wrapped in an extra 1-tuple). See
    // stylus-proc's sol_interface.rs `add_function` for the generated body.
    fn mock_is_registered(vm: &TestVM, creator_registry: Address, creator: Address, registered: bool) {
        let selector = &alloy_primitives::keccak256("isRegistered(address)")[..4];
        let mut calldata = selector.to_vec();
        calldata.extend(<(sol_data::Address,) as SolType>::abi_encode_params(&(creator,)));
        let return_data = <(sol_data::Bool,) as SolType>::abi_encode_params(&(registered,));
        vm.mock_static_call(creator_registry, calldata, Ok(return_data));
    }

    // KNOWN GAP: submit_review's success path, SelfReviewNotAllowed, AlreadyReviewed,
    // and the real (non-decode-failure) AssetNotFound branch are NOT unit-testable
    // against stylus-test 0.10.8's TestVM, and are deliberately not attempted here.
    //
    // Root cause, confirmed by tracing stylus-test 0.10.8's src/vm.rs: `mock_static_call`
    // writes the mocked return bytes into a single shared `state.return_data` buffer
    // *at registration time*. `static_call_contract` (invoked when the call actually
    // dispatches) looks up the correct per-(to, calldata) entry only to compute
    // `outs_len` for the success/revert status — it never refreshes `state.return_data`.
    // Immediately afterwards, `RawCall::call` reads the result via
    // `host.read_return_data(0, None)`, which always returns the *entire current*
    // `state.return_data` buffer, i.e. whatever was written by the most recently
    // *registered* mock — not the buffer belonging to the call that's actually
    // executing. So when two differently-shaped calls are mocked before invoking a
    // function that dispatches both sequentially (isRegistered then getAsset here),
    // only the last-registered mock's bytes are ever readable at either call site.
    //
    // Empirically confirmed with a minimal repro (two direct sequential calls, no
    // contract involved): with isRegistered mocked first and getAsset second, calling
    // isRegistered returned an ABI decode error whose reported bytes were exactly
    // getAsset's mocked creator address, not isRegistered's mocked bool — while
    // getAsset itself decoded correctly. Reversing the registration order flips which
    // call breaks, but the second call in *dispatch* order always reads a stale,
    // wrong-shaped buffer.
    //
    // Consequence for submit_review specifically: isRegistered always dispatches
    // first, and its own map_err(..)? short-circuits the whole function on any decode
    // failure. So isRegistered's mock MUST be registered last to let the code reach
    // getAsset at all — which guarantees getAsset then reads isRegistered's stale
    // 32-byte buffer and fails to decode (insufficient length for its 5-tuple), always
    // producing Err(AssetNotFound) via the call's own map_err, never a genuine decode
    // of a caller-supplied exists/creator value. That makes Ok(()), SelfReviewNotAllowed,
    // and AlreadyReviewed structurally unreachable in this harness, and would make an
    // "AssetNotFound" test pass for the wrong reason (decode failure, not an actual
    // exists=false decode) if attempted — so that variant is also skipped rather than
    // shipped as a misleading green check.
    //
    // `cargo update -p stylus-test --dry-run` confirms 0.10.8 is already the latest
    // available 0.10.x, so this isn't fixable by a patch bump; a fix would require a
    // stylus-sdk minor/major version change, which is out of scope here (and would
    // break the version consistency with creator-registry/asset-registry from item 1).

    #[test]
    fn test_submit_review_reviewer_not_registered() {
        let vm = TestVM::default();
        let mut contract = ReviewRegistry::from(&vm);

        let caller = Address::from([9u8; 20]);
        vm.set_sender(caller);
        let creator_registry = Address::from([7u8; 20]);
        let asset_registry = Address::from([8u8; 20]);
        let hash = FixedBytes::from([3u8; 32]);

        mock_is_registered(&vm, creator_registry, caller, false);

        let result = contract.submit_review(hash, 4, "QmCommentCid".into(), creator_registry, asset_registry);
        assert!(matches!(
            result,
            Err(ReviewRegistryError::ReviewerNotRegistered(_))
        ));
    }

    #[test]
    fn test_submit_review_invalid_rating_checked_before_any_cross_contract_call() {
        let vm = TestVM::default();
        let mut contract = ReviewRegistry::from(&vm);

        let caller = Address::from([9u8; 20]);
        vm.set_sender(caller);
        let creator_registry = Address::from([7u8; 20]);
        let asset_registry = Address::from([8u8; 20]);
        let hash = FixedBytes::from([3u8; 32]);

        // Deliberately no mock_static_call setup at all: an unmocked static call
        // returns Ok(empty bytes) rather than panicking (see stylus-test's
        // perform_mocked_static_call), which would fail ABI-decoding and surface
        // as ReviewerNotRegistered — not InvalidRating. So if these assertions see
        // InvalidRating, rating validation genuinely ran before either cross-contract
        // call; if the ordering were reversed, this test would observe
        // ReviewerNotRegistered instead and fail.
        let result_low = contract.submit_review(hash, 0, "QmCommentCid".into(), creator_registry, asset_registry);
        assert!(matches!(result_low, Err(ReviewRegistryError::InvalidRating(_))));

        let result_high = contract.submit_review(hash, 6, "QmCommentCid".into(), creator_registry, asset_registry);
        assert!(matches!(result_high, Err(ReviewRegistryError::InvalidRating(_))));
    }
}