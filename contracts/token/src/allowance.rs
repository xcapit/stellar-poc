use crate::storage_types::{AllowanceDataKey, AllowanceValue, DataKey};
use soroban_sdk::{Address, Env};

pub fn read_allowance(env: &Env, from: Address, spender: Address) -> AllowanceValue {
    let allowance_key = DataKey::Allowance(AllowanceDataKey { from, spender });
    if let Some(allowance) = env
        .storage()
        .temporary()
        .get::<_, AllowanceValue>(&allowance_key)
    {
        if allowance.expiration_ledger < env.ledger().sequence() {
            AllowanceValue {
                amount: 0,
                expiration_ledger: allowance.expiration_ledger,
            }
        } else {
            allowance
        }
    } else {
        AllowanceValue {
            amount: 0,
            expiration_ledger: 0,
        }
    }
}

pub fn write_allowance(
    env: &Env,
    from: Address,
    spender: Address,
    amount: i128,
    expiration_ledger: u32,
) {
    if amount > 0 && expiration_ledger < env.ledger().sequence() {
        panic!("expiration ledger is less than ledger sequence when amount > 0")
    }

    let allowance_key = DataKey::Allowance(AllowanceDataKey { from, spender });
    env.storage().temporary().set(
        &allowance_key,
        &AllowanceValue {
            amount,
            expiration_ledger,
        },
    );

    if amount > 0 {
        let live_for = expiration_ledger
            .checked_sub(env.ledger().sequence())
            .unwrap();
        env.storage()
            .temporary()
            .extend_ttl(&allowance_key, live_for, live_for);
    }
}

pub fn spend_allowance(env: &Env, from: Address, spender: Address, amount: i128) {
    let allowance = read_allowance(env, from.clone(), spender.clone());
    if allowance.amount < amount {
        panic!("insufficient allowance")
    }
    if amount > 0 {
        write_allowance(
            env,
            from,
            spender,
            allowance.amount - amount,
            allowance.expiration_ledger,
        );
    }
}
