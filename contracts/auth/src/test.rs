#![cfg(test)]

extern crate std;

use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, Env, IntoVal,
};

#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    assert_eq!(client.increment(&user1, &5), 5);
    assert_eq!(
        env.auths(),
        std::vec![(
            user1.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    contract_id.clone(),
                    symbol_short!("increment"),
                    (user1.clone(), 5_u32).into_val(&env),
                )),
                sub_invocations: std::vec![],
            }
        )]
    );
    assert_eq!(client.increment(&user1, &5), 10);
    assert_eq!(client.increment(&user1, &5), 10);
    assert_eq!(client.increment(&user2, &3), 3);
    assert_eq!(client.increment(&user2, &4), 7);
}
