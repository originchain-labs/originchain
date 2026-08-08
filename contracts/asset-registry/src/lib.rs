#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use alloc::{string::String, vec::Vec};
use alloy_primitives::{Address, FixedBytes, U64};
use alloy_sol_types::sol;
use stylus_sdk::prelude::*;

sol_storage! {
    #[entrypoint]
    pub struct AssetRegistry {
        mapping(bytes32 => AssetRecord) assets;
        mapping(address => bytes32[]) creator_assets;
    }

    pub struct AssetRecord {
        address creator;
        string ipfs_cid;
        string metadata_cid;
        uint64 registered_at;
        bool exists;
    }
}

sol! {
    event AssetRegistered(bytes32 indexed hash, address indexed creator, string ipfs_cid, uint64 timestamp);

    error AssetAlreadyExists();
    error CreatorNotRegistered();
}

#[derive(SolidityError)]
pub enum AssetRegistryError {
    AssetAlreadyExists(AssetAlreadyExists),
    CreatorNotRegistered(CreatorNotRegistered),
}

sol_interface! {
    interface ICreatorRegistry {
        function isRegistered(address creator) external view returns (bool);
    }
}

#[public]
impl AssetRegistry {
    pub fn register_asset(
        &mut self,
        hash: FixedBytes<32>,
        ipfs_cid: String,
        metadata_cid: String,
        creator_registry: Address,
    ) -> Result<(), AssetRegistryError> {
        let caller = self.vm().msg_sender();
        let timestamp = U64::from(self.vm().block_timestamp());

        let registry = ICreatorRegistry::new(creator_registry);
        let is_registered = registry
            .is_registered(self.vm(), Call::new(), caller)
            .map_err(|_| AssetRegistryError::CreatorNotRegistered(CreatorNotRegistered {}))?;
        if !is_registered {
            return Err(AssetRegistryError::CreatorNotRegistered(CreatorNotRegistered {}));
        }

        let mut record = self.assets.setter(hash);
        if record.exists.get() {
            return Err(AssetRegistryError::AssetAlreadyExists(AssetAlreadyExists {}));
        }

        record.creator.set(caller);
        record.ipfs_cid.set_str(&ipfs_cid);
        record.metadata_cid.set_str(&metadata_cid);
        record.registered_at.set(timestamp);
        record.exists.set(true);

        let mut creator_list = self.creator_assets.setter(caller);
        creator_list.push(hash);

        self.vm().log(AssetRegistered {
            hash,
            creator: caller,
            ipfs_cid,
            timestamp: timestamp.to::<u64>(),
        });

        Ok(())
    }

    pub fn get_asset(&self, hash: FixedBytes<32>) -> (Address, String, String, u64, bool) {
        let record = self.assets.get(hash);
        (
            record.creator.get(),
            record.ipfs_cid.get_string(),
            record.metadata_cid.get_string(),
            record.registered_at.get().to::<u64>(),
            record.exists.get(),
        )
    }

    pub fn asset_exists(&self, hash: FixedBytes<32>) -> bool {
        self.assets.get(hash).exists.get()
    }

    pub fn get_assets_by_creator(&self, creator: Address) -> Vec<FixedBytes<32>> {
        let list = self.creator_assets.get(creator);
        let len = list.len();
        let mut result = Vec::with_capacity(len);
        for i in 0..len {
            if let Some(h) = list.get(i) {
                result.push(h);
            }
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use alloy_sol_types::{sol_data, SolType};
    use stylus_sdk::testing::*;

    #[test]
    fn test_asset_exists_false_initially() {
        let vm = TestVM::default();
        let contract = AssetRegistry::from(&vm);
        let hash = FixedBytes::from([1u8; 32]);
        assert!(!contract.asset_exists(hash));
    }

    #[test]
    fn test_get_assets_by_creator_empty_initially() {
        let vm = TestVM::default();
        let contract = AssetRegistry::from(&vm);
        let result = contract.get_assets_by_creator(vm.msg_sender());
        assert_eq!(result.len(), 0);
    }

    #[test]
    fn test_get_asset_returns_default_for_unregistered_hash() {
        let vm = TestVM::default();
        let contract = AssetRegistry::from(&vm);
        let hash = FixedBytes::from([2u8; 32]);
        let (_, _, _, _, exists) = contract.get_asset(hash);
        assert!(!exists);
    }

    // Calldata/return-data encoding for `mock_static_call` must exactly match
    // what the `sol_interface!`-generated `is_registered` call constructs:
    // selector = keccak256("isRegistered(address)")[..4], args encoded via
    // sol_data::Address, return decoded via sol_data::Bool. See
    // stylus-proc's sol_interface.rs `add_function` for the generated body.
    fn mock_is_registered(vm: &TestVM, creator_registry: Address, creator: Address, registered: bool) {
        let selector = &alloy_primitives::keccak256("isRegistered(address)")[..4];
        let mut calldata = selector.to_vec();
        calldata.extend(<(sol_data::Address,) as SolType>::abi_encode_params(&(creator,)));
        let return_data = <(sol_data::Bool,) as SolType>::abi_encode_params(&(registered,));
        vm.mock_static_call(creator_registry, calldata, Ok(return_data));
    }

    #[test]
    fn test_register_asset_succeeds_when_creator_registered() {
        let vm = TestVM::default();
        let mut contract = AssetRegistry::from(&vm);

        let caller = Address::from([9u8; 20]);
        vm.set_sender(caller);
        let creator_registry = Address::from([7u8; 20]);
        mock_is_registered(&vm, creator_registry, caller, true);

        let hash = FixedBytes::from([3u8; 32]);
        let result = contract.register_asset(
            hash,
            "QmTestIpfsCid".into(),
            "QmTestMetadataCid".into(),
            creator_registry,
        );

        assert!(result.is_ok());
        assert!(contract.asset_exists(hash));

        let (creator, ipfs_cid, metadata_cid, _timestamp, exists) = contract.get_asset(hash);
        assert_eq!(creator, caller);
        assert_eq!(ipfs_cid, "QmTestIpfsCid");
        assert_eq!(metadata_cid, "QmTestMetadataCid");
        assert!(exists);

        let assets_by_creator = contract.get_assets_by_creator(caller);
        assert_eq!(assets_by_creator, alloc::vec![hash]);
    }

    #[test]
    fn test_register_asset_reverts_when_creator_not_registered() {
        let vm = TestVM::default();
        let mut contract = AssetRegistry::from(&vm);

        let caller = Address::from([9u8; 20]);
        vm.set_sender(caller);
        let creator_registry = Address::from([7u8; 20]);
        mock_is_registered(&vm, creator_registry, caller, false);

        let hash = FixedBytes::from([4u8; 32]);
        let result = contract.register_asset(
            hash,
            "QmTestIpfsCid".into(),
            "QmTestMetadataCid".into(),
            creator_registry,
        );

        assert!(matches!(
            result,
            Err(AssetRegistryError::CreatorNotRegistered(_))
        ));
        assert!(!contract.asset_exists(hash));
    }
}
