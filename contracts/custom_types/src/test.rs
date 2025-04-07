#![cfg(test)]

use super::*;
use soroban_sdk::Env;

#[test]
fn test_increment() {
    let value: u32 = 3;
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    client.increment(&value);
    let state = client.state();

    assert_eq!(value, state.count);
    assert_eq!(value, state.last_incr);
}

#[test]
fn test_multiple_increments() {
    let a_value: u32 = 3;
    let another_value: u32 = 7;
    let expected_count: u32 = 10;
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    client.increment(&a_value);
    client.increment(&another_value);
    let state = client.state();

    assert_eq!(expected_count, state.count);
    assert_eq!(another_value, state.last_incr);
}
