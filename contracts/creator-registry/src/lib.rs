#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use alloc::string::String;
use alloy_primitives::{Address, U256, U64};
use alloy_sol_types::sol;
use stylus_sdk::prelude::*;

sol_storage! {
    #[entrypoint]
    pub struct CreatorRegistry {
        mapping(address => CreatorRecord) creators;
        uint256 creator_count;
    }

    pub struct CreatorRecord {
        string profile_cid;
        uint64 registered_at;
        bool is_active;
    }
}

sol! {
    event CreatorRegistered(address indexed creator, string profile_cid, uint64 timestamp);
    event ProfileUpdated(address indexed creator, string new_profile_cid);
    event CreatorDeactivated(address indexed creator);

    error AlreadyRegistered();
    error NotRegistered();
    error AlreadyDeactivated();
}

#[derive(SolidityError)]
pub enum CreatorRegistryError {
    AlreadyRegistered(AlreadyRegistered),
    NotRegistered(NotRegistered),
    AlreadyDeactivated(AlreadyDeactivated),
}

impl core::fmt::Debug for CreatorRegistryError {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            CreatorRegistryError::AlreadyRegistered(_) => write!(f, "AlreadyRegistered"),
            CreatorRegistryError::NotRegistered(_) => write!(f, "NotRegistered"),
            CreatorRegistryError::AlreadyDeactivated(_) => write!(f, "AlreadyDeactivated"),
        }
    }
}

#[public]
impl CreatorRegistry {
    pub fn register_creator(&mut self, profile_cid: String) -> Result<(), CreatorRegistryError> {
        let caller = self.vm().msg_sender();
        let timestamp = U64::from(self.vm().block_timestamp());
        let mut record = self.creators.setter(caller);

        if record.is_active.get() {
            return Err(CreatorRegistryError::AlreadyRegistered(AlreadyRegistered {}));
        }

        record.profile_cid.set_str(&profile_cid);
        record.registered_at.set(timestamp);
        record.is_active.set(true);

        let count = self.creator_count.get() + U256::from(1);
        self.creator_count.set(count);

        self.vm().log(CreatorRegistered {
            creator: caller,
            profile_cid,
            timestamp: timestamp.to::<u64>(),
        });

        Ok(())
    }

    pub fn update_profile_cid(&mut self, profile_cid: String) -> Result<(), CreatorRegistryError> {
        let caller = self.vm().msg_sender();
        let mut record = self.creators.setter(caller);

        if !record.is_active.get() {
            return Err(CreatorRegistryError::NotRegistered(NotRegistered {}));
        }

        record.profile_cid.set_str(&profile_cid);

        self.vm().log(ProfileUpdated {
            creator: caller,
            new_profile_cid: profile_cid,
        });

        Ok(())
    }

    pub fn deactivate_creator(&mut self) -> Result<(), CreatorRegistryError> {
        let caller = self.vm().msg_sender();
        let mut record = self.creators.setter(caller);

        if !record.is_active.get() {
            return Err(CreatorRegistryError::AlreadyDeactivated(AlreadyDeactivated {}));
        }

        record.is_active.set(false);

        self.vm().log(CreatorDeactivated { creator: caller });

        Ok(())
    }

    pub fn get_creator(&self, creator: Address) -> (String, u64, bool) {
        let record = self.creators.get(creator);
        (
            record.profile_cid.get_string(),
            record.registered_at.get().to::<u64>(),
            record.is_active.get(),
        )
    }

    pub fn is_registered(&self, creator: Address) -> bool {
        self.creators.get(creator).is_active.get()
    }

    pub fn creator_count(&self) -> U256 {
        self.creator_count.get()
    }
}



#[cfg(test)]
mod tests {
    use super::*;
    use stylus_sdk::testing::*;

    #[test]
    fn test_register_creator() {
        let vm = TestVM::default();
        let mut contract = CreatorRegistry::from(&vm);

        let result = contract.register_creator("QmTestCid123".into());
        assert!(result.is_ok());
        assert!(contract.is_registered(vm.msg_sender()));

        let (cid, _timestamp, is_active) = contract.get_creator(vm.msg_sender());
        assert_eq!(cid, "QmTestCid123");
        assert!(is_active);
    }

    #[test]
    fn test_cannot_register_twice() {
        let vm = TestVM::default();
        let mut contract = CreatorRegistry::from(&vm);

        contract.register_creator("QmFirst".into()).unwrap();
        let result = contract.register_creator("QmSecond".into());

        assert!(matches!(
            result,
            Err(CreatorRegistryError::AlreadyRegistered(_))
        ));
    }

    #[test]
    fn test_update_profile_cid() {
        let vm = TestVM::default();
        let mut contract = CreatorRegistry::from(&vm);

        contract.register_creator("QmOriginal".into()).unwrap();
        contract.update_profile_cid("QmUpdated".into()).unwrap();

        let (cid, _, _) = contract.get_creator(vm.msg_sender());
        assert_eq!(cid, "QmUpdated");
    }

    #[test]
    fn test_update_requires_registration() {
        let vm = TestVM::default();
        let mut contract = CreatorRegistry::from(&vm);

        let result = contract.update_profile_cid("QmNope".into());
        assert!(matches!(
            result,
            Err(CreatorRegistryError::NotRegistered(_))
        ));
    }

    #[test]
    fn test_deactivate_creator() {
        let vm = TestVM::default();
        let mut contract = CreatorRegistry::from(&vm);

        contract.register_creator("QmActive".into()).unwrap();
        contract.deactivate_creator().unwrap();

        assert!(!contract.is_registered(vm.msg_sender()));
    }

    #[test]
    fn test_unregistered_address_returns_false() {
        let vm = TestVM::default();
        let contract = CreatorRegistry::from(&vm);
        assert!(!contract.is_registered(vm.msg_sender()));
    }
}