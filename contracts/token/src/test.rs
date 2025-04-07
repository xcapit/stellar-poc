#![cfg(test)]
extern crate std;

use crate::{contract::Token, TokenClient};
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, Env, FromVal, IntoVal, String, Symbol,
};

fn create_token<'a>(env: &Env, admin: &Address) -> TokenClient<'a> {
    let contract = env.register(
        Token,
        (
            admin,
            7u32,
            String::from_val(env, &"name"),
            String::from_val(env, &"symbol"),
        ),
    );
    TokenClient::new(env, &contract)
}

fn env_with_mock_auths() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env
}

fn random_addresses(env: &Env, quantity: usize) -> std::vec::Vec<Address> {
    (0..quantity).map(|_| Address::generate(env)).collect()
}

#[test]
fn test() {
    let env = env_with_mock_auths();
    let [admin1, admin2, user1, user2, user3] = random_addresses(&env, 5).try_into().unwrap();
    let token = create_token(&env, &admin1);

    token.mint(&user1, &1000);

    assert_eq!(
        env.auths(),
        std::vec![(
            admin1.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    symbol_short!("mint"),
                    (&user1, 1000_i128).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(token.balance(&user1), 1000);

    token.approve(&user2, &user3, &500, &200);

    assert_eq!(
        env.auths(),
        std::vec![(
            user2.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    symbol_short!("approve"),
                    (&user2, &user3, 500_i128, 200_u32).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(token.allowance(&user2, &user3), 500);

    token.transfer(&user1, &user2, &600);

    assert_eq!(
        env.auths(),
        std::vec![(
            user1.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    symbol_short!("transfer"),
                    (&user1, &user2, 600_i128).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );
    assert_eq!(token.balance(&user1), 400);
    assert_eq!(token.balance(&user2), 600);

    token.transfer_from(&user3, &user2, &user1, &400);

    assert_eq!(
        env.auths(),
        std::vec![(
            user3.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    Symbol::new(&env, "transfer_from"),
                    (&user3, &user2, &user1, 400_i128).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(token.balance(&user1), 800);
    assert_eq!(token.balance(&user2), 200);

    token.transfer(&user1, &user3, &300);

    assert_eq!(token.balance(&user1), 500);
    assert_eq!(token.balance(&user3), 300);

    token.set_admin(&admin2);

    assert_eq!(
        env.auths(),
        std::vec![(
            admin1.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    symbol_short!("set_admin"),
                    (&admin2,).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );

    token.approve(&user2, &user3, &500, &200);

    assert_eq!(token.allowance(&user2, &user3), 500);

    token.approve(&user2, &user3, &0, &200);

    assert_eq!(
        env.auths(),
        std::vec![(
            user2.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    symbol_short!("approve"),
                    (&user2, &user3, 0_i128, 200_u32).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(token.allowance(&user2, &user3), 0);
}

#[test]
fn test_burn() {
    let env = env_with_mock_auths();
    let admin = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let token = create_token(&env, &admin);

    token.mint(&user1, &1000);

    assert_eq!(token.balance(&user1), 1000);

    token.approve(&user1, &user2, &500, &200);

    assert_eq!(token.allowance(&user1, &user2), 500);

    token.burn_from(&user2, &user1, &500);

    assert_eq!(
        env.auths(),
        std::vec![(
            user2.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    symbol_short!("burn_from"),
                    (&user2, &user1, 500_i128).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(token.allowance(&user1, &user2), 0);
    assert_eq!(token.balance(&user1), 500);
    assert_eq!(token.balance(&user2), 0);

    token.burn(&user1, &500);

    assert_eq!(
        env.auths(),
        std::vec![(
            user1.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    token.address.clone(),
                    symbol_short!("burn"),
                    (&user1, 500_i128).into_val(&env),
                )),
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(token.balance(&user1), 0);
    assert_eq!(token.balance(&user2), 0);
}

#[test]
#[should_panic(expected = "insufficient balance")]
fn transfer_insufficient_balance() {
    let env = env_with_mock_auths();
    let admin = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let token = create_token(&env, &admin);

    token.mint(&user1, &1000);
    assert_eq!(token.balance(&user1), 1000);

    token.transfer(&user1, &user2, &1001);
}

#[test]
#[should_panic(expected = "insufficient allowance")]
fn transfer_insufficient_allowance() {
    let env = env_with_mock_auths();
    let [admin, user1, user2, user3] = random_addresses(&env, 4).try_into().unwrap();
    let token = create_token(&env, &admin);

    token.mint(&user1, &1000);
    assert_eq!(token.balance(&user1), 1000);

    token.approve(&user1, &user3, &100, &200);
    assert_eq!(token.allowance(&user1, &user3), 100);

    token.transfer_from(&user3, &user1, &user2, &101);
}

#[test]
#[should_panic(expected = "Decimal must not be greater than 18")]
fn decimal_is_over_eighteen() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let _ = TokenClient::new(
        &env,
        &env.register(
            Token,
            (
                admin,
                19_u32,
                String::from_val(&env, &"name"),
                String::from_val(&env, &"symbol"),
            ),
        ),
    );
}

#[test]
fn test_zero_allowance() {
    let env = env_with_mock_auths();
    let [admin, spender, from] = random_addresses(&env, 3).try_into().unwrap();
    let token = create_token(&env, &admin);

    token.transfer_from(&spender, &from, &spender, &0);

    assert!(token.get_allowance(&from, &spender).is_none());
}
