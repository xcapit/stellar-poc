#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct State {
    pub count: u32,
    pub last_incr: u32,
}

const STATE: Symbol = symbol_short!("STATE");

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    pub fn increment(env: &Env, incr: u32) {
        let mut state = Self::state(env);
        state.count += incr;
        state.last_incr = incr;
        env.storage().instance().set(&STATE, &state);
    }

    pub fn state(env: &Env) -> State {
        env.storage().instance().get(&STATE).unwrap_or(State {
            count: 0,
            last_incr: 0,
        })
    }
}

mod test;
