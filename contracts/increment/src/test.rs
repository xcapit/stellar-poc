#![cfg(test)]

use super::{IncrementContract, IncrementContractClient};
use soroban_sdk::{testutils::Logs, Env};

extern crate std;

fn contract_client(env: &Env) -> IncrementContractClient {
    let contract_id = env.register_contract(None, IncrementContract);
    IncrementContractClient::new(&env, &contract_id)
}

#[test]
fn test_increment() {
    let env = Env::default();
    let client = contract_client(&env);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.increment(), 3);

    std::println!("{}", env.logs().all().join("\n"));
}

#[test]
fn test_current_value() {
    let env = Env::default();
    let client = contract_client(&env);
    client.increment();
    client.increment();

    assert_eq!(client.value(), 2);

    std::println!("{}", env.logs().all().join("\n"));
}

#[test]
fn test_decrement() {
    let env = Env::default();
    let client = contract_client(&env);
    client.increment();
    client.increment();

    client.decrement();

    assert_eq!(client.value(), 1);

    std::println!("{}", env.logs().all().join("\n"));
}