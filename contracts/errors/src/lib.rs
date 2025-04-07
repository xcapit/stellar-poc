#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, log, symbol_short, Env, Symbol};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    LimitReached = 1,
}

const MAX: u32 = 5;
const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    pub fn increment(env: &Env) -> Result<u32, Error> {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        log!(env, "count {}", count);
        count += 1;
        match count {
            value if value > MAX => Err(Error::LimitReached),
            _ => {
                env.storage().instance().set(&COUNTER, &count);
                Ok(count)
            }
        }
    }
}

mod test;
