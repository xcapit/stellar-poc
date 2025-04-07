use soroban_sdk::{Address, Env};

use crate::storage_types::DataKey;

pub fn read_administrator(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn write_administrator(env: &Env, id: &Address) {
    env.storage().instance().set(&DataKey::Admin, id);
}
