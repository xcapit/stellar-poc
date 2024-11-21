# Soroban Project

This project showcases initial experiments with Soroban.

## Project Structure

This repository uses the recommended structure for a Soroban project:
```text
.
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
│   └── increment
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```
### Stellar keys generation 
```bash
stellar keys generate --global bob --network testnet
```
```bash
stellar keys address bob                                                                                                                                                  │
GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM   
```

### Deployed contracts
```bash
stellar contract deploy \
∙ --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
∙ --source bob \
∙ --network testnet
ℹ Skipping install because wasm already installed
ℹ Using wasm hash 1f0539c593ab8c88ac6f25947cc78e58988ce3b7782c659d4c781be5fdeea553
ℹ Simulating deploy transaction…
🌎 Submitting deploy transaction…
ℹ Transaction hash is a24d94b412f340615ebfcd5e416098364911c9aa9b02bca6c00e84fb1381f111
🔗 https://stellar.expert/explorer/testnet/tx/a24d94b412f340615ebfcd5e416098364911c9aa9b02bca6c00e84fb1381f111
ℹ Signing transaction: a24d94b412f340615ebfcd5e416098364911c9aa9b02bca6c00e84fb1381f111
🔗 https://stellar.expert/explorer/testnet/contract/CB7Q5NDBIFIJV6FVEEW4AK4HHZXLFLYH4UX5LOXVDDNS3SN5RZ4LLZLL
✅ Deployed!
CB7Q5NDBIFIJV6FVEEW4AK4HHZXLFLYH4UX5LOXVDDNS3SN5RZ4LLZLL
```
```bash
stellar contract install \
∙ --network testnet \
∙ --source bob \
∙ --wasm target/wasm32-unknown-unknown/release/increment.wasm
ℹ Simulating install transaction…
🌎 Submitting install transaction…
ℹ Signing transaction: 4cc073aad6287017f4d1f87cf61fddab9321bf287067c9ac7a0f9432ba3799f9
8f15b24cb2bdf7cbca14bd3c53d13675d7cdf8cc76f52e1e0327f34139c80060
```
```bash
stellar contract deploy \
∙ --wasm-hash 8f15b24cb2bdf7cbca14bd3c53d13675d7cdf8cc76f52e1e0327f34139c80060 \
∙ --source bob \
∙ --network testnet
ℹ Using wasm hash 8f15b24cb2bdf7cbca14bd3c53d13675d7cdf8cc76f52e1e0327f34139c80060
ℹ Simulating deploy transaction…
🌎 Submitting deploy transaction…
ℹ Transaction hash is da5b054c45a2deadd3634ea76f8b4fda7977e9dfc65e167fb7cc5fb7f35080db
🔗 https://stellar.expert/explorer/testnet/tx/da5b054c45a2deadd3634ea76f8b4fda7977e9dfc65e167fb7cc5fb7f35080db
ℹ Signing transaction: da5b054c45a2deadd3634ea76f8b4fda7977e9dfc65e167fb7cc5fb7f35080db
🔗 https://stellar.expert/explorer/testnet/contract/CDQQUGBVMH5OYXK6QWADY2CXPOPTAZWA4DG73PGZZOW35WIKMM7FQGBR
✅ Deployed!
CDQQUGBVMH5OYXK6QWADY2CXPOPTAZWA4DG73PGZZOW35WIKMM7FQGBR
```
### Some contract invokes
```bash
stellar contract invoke \
∙ --id CDQQUGBVMH5OYXK6QWADY2CXPOPTAZWA4DG73PGZZOW35WIKMM7FQGBR \
∙ --source bob \
∙ --network testnet \
∙ -- \
∙ increment
ℹ Signing transaction: 4c38caa86e5adf29cdde90d9fa76f1ddb2a501d8317c5121ada1cc6092602e10
1
```
```bash
stellar contract invoke \
--id CDQQUGBVMH5OYXK6QWADY2CXPOPTAZWA4DG73PGZZOW35WIKMM7FQGBR \
--source bob \
--network testnet --send yes \
-- \
value
ℹ Signing transaction: f85921f073876f43f32fd9f73b6d2d0476dd142eabd20cc45e58f26ee1d4ed26
2
```
```bash
stellar contract invoke \
--id CDQQUGBVMH5OYXK6QWADY2CXPOPTAZWA4DG73PGZZOW35WIKMM7FQGBR \
--source bob \
--network testnet \
-- \
decrement
ℹ Signing transaction: f889897ea5003e5e260be39b9c22848c1814239fa06b3f0ffd41830c50ce5a46
```
```bash
stellar contract invoke \
--id CDQQUGBVMH5OYXK6QWADY2CXPOPTAZWA4DG73PGZZOW35WIKMM7FQGBR \
--source bob \
--network testnet --send yes \
-- \
value
ℹ Signing transaction: a3bd84690629a0e40f00c0a92376ca6421ce8d937237ea73a50904ea5da051b9
1
```

### Links
The contracts and the transactions are in stellar testnet: https://stellar.expert/explorer/testnet/account/GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM

#### Note 
Some extra features were added to the increment contract.
