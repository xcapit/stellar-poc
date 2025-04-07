use crate::storage_types::{DataKey, BALANCE_BUMP_AMOUNT, BALANCE_LIFETIME_THRESHOLD};
use soroban_sdk::{Address, Env};

pub fn read_balance(env: &Env, address: Address) -> i128 {
    let balance_key = DataKey::Balance(address);
    if let Some(balance) = env
        .storage()
        .persistent()
        .get::<DataKey, i128>(&balance_key)
    {
        env.storage().persistent().extend_ttl(
            &balance_key,
            BALANCE_LIFETIME_THRESHOLD,
            BALANCE_BUMP_AMOUNT,
        );
        balance
    } else {
        0
    }
}

pub fn write_balance(env: &Env, address: Address, amount: i128) {
    let balance_key = DataKey::Balance(address);
    env.storage().persistent().set(&balance_key, &amount);
    env.storage().persistent().extend_ttl(
        &balance_key,
        BALANCE_LIFETIME_THRESHOLD,
        BALANCE_BUMP_AMOUNT,
    );
}

pub fn receive_balance(env: &Env, address: Address, amount: i128) {
    write_balance(env, address.clone(), read_balance(env, address) + amount)
}

pub fn spend_balance(env: &Env, address: Address, amount: i128) {
    let balance = read_balance(env, address.clone());
    if balance < amount {
        panic!("insufficient balance");
    }
    write_balance(env, address, balance - amount);
}
