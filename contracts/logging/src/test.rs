#![cfg(test)]

extern crate std;

use super::*;
use soroban_sdk::{symbol_short, testutils::Logs, vec, Env, String};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.hello(&symbol_short!("Dev"));

    assert_eq!(env.logs().all(), std::vec!["[Diagnostic Event] contract:CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM, topics:[log], data:[\"Hello {}\", Dev]"]);
}
