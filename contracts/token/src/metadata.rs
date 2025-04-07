use soroban_sdk::{Env, String};
use soroban_token_sdk::{metadata::TokenMetadata, TokenUtils};

pub fn read_decimal(env: &Env) -> u32 {
    TokenUtils::new(env).metadata().get_metadata().decimal
}

pub fn read_name(env: &Env) -> String {
    TokenUtils::new(env).metadata().get_metadata().name
}

pub fn read_symbol(env: &Env) -> String {
    TokenUtils::new(env).metadata().get_metadata().symbol
}

pub fn write_metadata(env: &Env, metadata: TokenMetadata) {
    TokenUtils::new(env).metadata().set_metadata(&metadata);
}
