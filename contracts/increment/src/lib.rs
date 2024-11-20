#![no_std]
use soroban_sdk::{contract, contractimpl, log, symbol_short, Env, Symbol};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {

    pub fn value(env: Env) -> u32 {
        IncrementContract::extend_ttl(&env);
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }

    pub fn decrement(env: Env) {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        if count > 0 {
            count -= 1;
            env.storage().instance().set(&COUNTER, &count);
        }
        IncrementContract::extend_ttl(&env);
    }

    pub fn increment(env: Env) -> u32 {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0); // If no value set, assume 0.
        log!(&env, "count: {}", count);
        count += 1;
        env.storage().instance().set(&COUNTER, &count);
        IncrementContract::extend_ttl(&env);

        count
    }

    fn extend_ttl(env: &Env) {
        env.storage().instance().extend_ttl(50, 100);
    }
}

mod test;