#![no_std]

use soroban_sdk::{
    auth::{Context, CustomAccountInterface},
    contract, contracterror, contractimpl, contracttype,
    crypto::Hash,
    symbol_short, Address, BytesN, Env, Map, Symbol, TryIntoVal, Vec,
};

#[contract]
struct AccountContract;

#[contracttype]
#[derive(Clone)]
pub struct AccSignature {
    pub public_key: BytesN<32>,
    pub signature: BytesN<64>,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    SignerCnt,
    Signer(BytesN<32>),
    SpendLimit(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AccError {
    NotEnoughSigners = 1,
    NegativeAmount = 2,
    BadSignatureOrder = 3,
    UnknownSigner = 4,
}

const TRANSFER_FN: Symbol = symbol_short!("transfer");
const APPROVE_FN: Symbol = symbol_short!("approve");
const BURN_FN: Symbol = symbol_short!("burn");

#[contractimpl]
impl AccountContract {
    pub fn __constructor(env: Env, signers: Vec<BytesN<32>>) {
        for signer in signers.iter() {
            env.storage().instance().set(&DataKey::Signer(signer), &());
        }
        env.storage()
            .instance()
            .set(&DataKey::SignerCnt, &signers.len());
    }

    pub fn add_limit(env: Env, token: Address, limit: i128) {
        env.current_contract_address().require_auth();
        env.storage()
            .instance()
            .set(&DataKey::SpendLimit(token), &limit);
    }
}

#[contractimpl]
impl CustomAccountInterface for AccountContract {
    type Signature = Vec<AccSignature>;
    type Error = AccError;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signatures: Self::Signature,
        auth_context: Vec<Context>,
    ) -> Result<(), AccError> {
        authenticate(&env, &signature_payload, &signatures)?;

        let tot_signers: u32 = env
            .storage()
            .instance()
            .get::<_, u32>(&DataKey::SignerCnt)
            .unwrap();
        let all_signed = tot_signers == signatures.len();
        let curr_contract = env.current_contract_address();

        let mut spend_left_per_token = Map::<Address, i128>::new(&env);
        for context in auth_context.iter() {
            verify_authorization_policy(
                &env,
                &context,
                &curr_contract,
                all_signed,
                &mut spend_left_per_token,
            )?;
        }
        Ok(())
    }
}

fn authenticate(
    env: &Env,
    signature_payload: &Hash<32>,
    signatures: &Vec<AccSignature>,
) -> Result<(), AccError> {
    for i in 0..signatures.len() {
        let signature = signatures.get_unchecked(i);
        if i > 0 {
            let prev_signature = signatures.get_unchecked(i - 1);
            if prev_signature.public_key >= signature.public_key {
                return Err(AccError::BadSignatureOrder);
            }
        }
        if !env
            .storage()
            .instance()
            .has(&DataKey::Signer(signature.public_key.clone()))
        {
            return Err(AccError::UnknownSigner);
        }
        env.crypto().ed25519_verify(
            &signature.public_key,
            &signature_payload.clone().into(),
            &signature.signature,
        );
    }
    Ok(())
}

fn verify_authorization_policy(
    env: &Env,
    context: &Context,
    curr_contract: &Address,
    all_signed: bool,
    spend_left_per_token: &mut Map<Address, i128>,
) -> Result<(), AccError> {
    if all_signed {
        return Ok(());
    }
    let contract_context = match context {
        Context::Contract(c) => {
            if &c.contract == curr_contract {
                return Err(AccError::NotEnoughSigners);
            }
            c
        }
        Context::CreateContractHostFn(_) | Context::CreateContractWithCtorHostFn(_) => {
            return Err(AccError::NotEnoughSigners);
        }
    };
    if contract_context.fn_name != TRANSFER_FN
        && contract_context.fn_name != APPROVE_FN
        && contract_context.fn_name != BURN_FN
    {
        return Ok(());
    }

    let spend_left: Option<i128> =
        if let Some(spend_left) = spend_left_per_token.get(contract_context.contract.clone()) {
            Some(spend_left)
        } else if let Some(limit_left) = env
            .storage()
            .instance()
            .get::<_, i128>(&DataKey::SpendLimit(contract_context.contract.clone()))
        {
            Some(limit_left)
        } else {
            None
        };

    if let Some(spend_left) = spend_left {
        let spent: i128 = contract_context
            .args
            .get(2)
            .unwrap()
            .try_into_val(env)
            .unwrap();
        if spent < 0 {
            return Err(AccError::NegativeAmount);
        }
        if !all_signed && spent > spend_left {
            return Err(AccError::NotEnoughSigners);
        }
        spend_left_per_token.set(contract_context.contract.clone(), spend_left - spent);
    }
    Ok(())
}

mod test;
