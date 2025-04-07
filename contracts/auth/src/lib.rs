#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
pub enum DataKey {
    Counter(Address),
}

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    pub fn increment(env: &Env, user: Address, value: u32) -> u32 {
        user.require_auth();
        let key = DataKey::Counter(user);
        let mut count: u32 = env.storage().persistent().get(&key).unwrap_or_default();

        count += value;

        env.storage().persistent().set(&key, &value);

        count
    }
}

mod test;
