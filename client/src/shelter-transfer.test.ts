import {
  contract,
  hash,
  Keypair,
  Networks,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";
import { Stellar, walletSdk } from "@stellar/typescript-wallet-sdk";
import { SAC } from "./sac";
import { Shelter } from "./shelter";

describe("shelter indirect invocation", () => {
  const amount = 1;
  const aliceSecret =
    "SDZVEQPNLS74A5E7VDSUHV2EDUJJUBNNT46PRNGAJXM4SZCBGIYGAZEX";
  const aliceKeyPair = Keypair.fromSecret(aliceSecret);
  const tokenContractId =
    "CDOE74SDU5HUEBKJJCHQJPFSU5CGARYWSHRJCEWY73APTOL2QFD5DQ56";
  const shelterAddress = "CBJBDS4RJOTOKIGK5GX5GKSSTTZXCYB2EGZATSBH7B27HN7TDJTKPRBI";
  const merch = "GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM";
  const rpcUrl = "https://soroban-rpc.testnet.stellar.gateway.fm";
  const rpcServer = new rpc.Server(rpcUrl);
  const mintedTokensToShelter = 1000

  const stewardSecret =
    "SBHI4QJTEFZ64FTZ4M67TKU4C7QZTFERCSSYCCI5A4FSFR3Z4TC2DPHR";
  const stewardKeypair = Keypair.fromSecret(stewardSecret);

  let stellar: Stellar;

  const _sac = (publicKey: string) =>
    new SAC({
      networkPassphrase: Networks.TESTNET,
      rpcUrl,
    }).getSACClient(tokenContractId, publicKey);

  const shelter = new Shelter({
    contractId: shelterAddress,
    networkPassphrase: Networks.TESTNET,
    rpcUrl: rpcUrl,
    publicKey: stewardKeypair.publicKey(),
  });

  const _randomKeyPair = async (): Promise<Keypair> => {
    const stellar = walletSdk.Wallet.TestNet().stellar();
    const account = stellar.account().createKeypair();
    await stellar.fundTestnetAccount(account.publicKey);
    return Keypair.fromSecret(account.secretKey);
  };

  const _signAuthEntry = async (
    entry: xdr.SorobanAuthorizationEntry,
    options: {
      keypair: Keypair;
    }
  ) => {
    const credentials = entry.credentials().address();

    let expiration = credentials.signatureExpirationLedger();

    if (!expiration) {
      const { sequence } = await rpcServer.getLatestLedger();
      expiration = sequence + contract.DEFAULT_TIMEOUT / 5;
    }
    credentials.signatureExpirationLedger(expiration);

    const preimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(
      new xdr.HashIdPreimageSorobanAuthorization({
        networkId: hash(Buffer.from(Networks.TESTNET)),
        nonce: credentials.nonce(),
        signatureExpirationLedger: credentials.signatureExpirationLedger(),
        invocation: entry.rootInvocation(),
      })
    );

    const payload = hash(preimage.toXDR());

    const signature = options.keypair.sign(payload);

    const shelterSignature = {
      public_key: options.keypair.rawPublicKey(),
      signature: signature,
    };

    const shelter = new Shelter({
      contractId: shelterAddress,
      networkPassphrase: Networks.TESTNET,
      rpcUrl: rpcUrl,
    });
    const scValType = xdr.ScSpecTypeDef.scSpecTypeUdt(
      new xdr.ScSpecTypeUdt({ name: "Pass" })
    );

    const scVal = shelter.spec.nativeToScVal(shelterSignature, scValType);

    switch (credentials.signature().switch().name) {
      case "scvVoid":
        console.log("add in void");
        credentials.signature(scVal);
        break;
      case "scvVec":
        // Add the new signature to the existing map
        // TODO: ?
        // credentials.signature().vec()?.[0].map()?.push(scVal)
        console.log("add vec?");
        // Order the map by key
        // Not using Buffer.compare because Symbols are 9 bytes and unused bytes _append_ 0s vs prepending them, which is too bad
        credentials
          .signature()
          .vec()?.[0]
          .map()
          ?.sort((a, b) => {
            return (
              a.key().vec()![0].sym() + a.key().vec()![1].toXDR().join("")
            ).localeCompare(
              b.key().vec()![0].sym() + b.key().vec()![1].toXDR().join("")
            );
          });
        break;
      default:
        throw new Error("Unsupported signature");
    }

    return entry;
  };

  const _sign = async (txn: any, options: { keypair: Keypair }) => {
    await txn.signAuthEntries({
      address: shelterAddress,
      authorizeEntry: (entry: any) => {
        const clone = xdr.SorobanAuthorizationEntry.fromXDR(entry.toXDR());
        return _signAuthEntry(clone, options);
      },
    });

    return txn;
  };

  const _validExpiration = Math.floor(Date.now() / 1000) + 7200;
  const _invalidExpiration = Math.floor(Date.now() / 1000) - 7200;

  beforeEach(() => {
    stellar = walletSdk.Wallet.TestNet().stellar();
  });

  test("transfer", async () => {
    const at: any = await _sac("").transfer({
      from: shelterAddress,
      to: merch,
      amount: BigInt(amount),
    });
    await _sign(at, { keypair: aliceKeyPair });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);
    const completeTx = rpc.assembleTransaction(buildTx, simTx).build();
    completeTx.sign(aliceKeyPair);

    const sendTx = await rpcServer.sendTransaction(completeTx);
    console.log("hash", sendTx.hash);

    const txResponse = await rpcServer.pollTransaction(sendTx.hash);

    expect(txResponse.status).toEqual("SUCCESS");
  }, 5000000);

  test("transfer from shelter", async () => {
    console.log("--- TRANSFER FROM SHELTER ---");

    const bob = await _randomKeyPair();

    const tx = await shelter.bound_aid({
      recipient: bob.rawPublicKey(),
      token: tokenContractId,
      amount: BigInt(amount),
      expiration: BigInt(_validExpiration),
    });

    const boundBuildTx = tx.built!;

    boundBuildTx.sign(stewardKeypair);

    const boundTx = await rpcServer.sendTransaction(boundBuildTx);
    console.log("[BOUND AID HASH]:", boundTx.hash);

    const boundTxResponse = await rpcServer.pollTransaction(boundTx.hash);
    expect(boundTxResponse.status).toEqual("SUCCESS");

    const at: any = await _sac(bob.publicKey()).transfer({
      from: shelterAddress,
      to: merch,
      amount: BigInt(amount),
    });
    await _sign(at, { keypair: bob });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);
    const completeTx = rpc.assembleTransaction(buildTx, simTx).build();
    completeTx.sign(bob);

    const sendTx = await rpcServer.sendTransaction(completeTx);
    console.log("[TRANSFER HASH]:", sendTx.hash);

    const txResponse = await rpcServer.pollTransaction(sendTx.hash);

    expect(txResponse.status).toEqual("SUCCESS");
  }, 5000000);

  test("attacker try to use a recipient aid", async () => {
    const bob = await _randomKeyPair();

    const tx = await shelter.bound_aid({
      recipient: bob.rawPublicKey(),
      token: tokenContractId,
      amount: BigInt(amount),
      expiration: BigInt(_validExpiration),
    });

    const boundBuildTx = tx.built!;

    boundBuildTx.sign(stewardKeypair);

    const boundTx = await rpcServer.sendTransaction(boundBuildTx);

    const boundTxResponse = await rpcServer.pollTransaction(boundTx.hash);
    expect(boundTxResponse.status).toEqual("SUCCESS");

    const attacker = await _randomKeyPair();

    const at: any = await _sac(bob.publicKey()).transfer({
      from: shelterAddress,
      to: merch,
      amount: BigInt(amount),
    });
    await _sign(at, { keypair: bob });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);
    const completeTx = rpc.assembleTransaction(buildTx, simTx).build();

    completeTx.sign(attacker);

    const sendTx = await rpcServer.sendTransaction(completeTx);

    const txResponse = await rpcServer.pollTransaction(sendTx.hash);

    expect(txResponse.status).toEqual("NOT_FOUND");
  }, 5000000);

  test("transfer failed, not enough aid", async () => {
    const bob = await _randomKeyPair();

    const tx = await shelter.bound_aid({
      recipient: bob.rawPublicKey(),
      token: tokenContractId,
      amount: BigInt(amount),
      expiration: BigInt(_validExpiration),
    });

    const boundBuildTx = tx.built!;

    boundBuildTx.sign(stewardKeypair);

    const boundTx = await rpcServer.sendTransaction(boundBuildTx);

    const boundTxResponse = await rpcServer.pollTransaction(boundTx.hash);
    expect(boundTxResponse.status).toEqual("SUCCESS");

    const at: any = await _sac(bob.publicKey()).transfer({
      from: shelterAddress,
      to: merch,
      amount: BigInt(amount * 2),
    });
    await _sign(at, { keypair: bob });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);

    expect(() => rpc.assembleTransaction(buildTx, simTx).build()).toThrow();
  }, 5000000);

  test("transfer failed after unbound aid", async () => {
    console.log("--- TRANSFER FAILED AFTER UNBOUND AID ---");

    const bob = await _randomKeyPair();

    const boundRawTx = await shelter.bound_aid({
      recipient: bob.rawPublicKey(),
      token: tokenContractId,
      amount: BigInt(amount),
      expiration: BigInt(_validExpiration),
    });

    const boundBuildTx = boundRawTx.built!;

    boundBuildTx.sign(stewardKeypair);

    const boundTx = await rpcServer.sendTransaction(boundBuildTx);
    console.log("[BOUND AID HASH]:", boundTx.hash);

    const boundTxResponse = await rpcServer.pollTransaction(boundTx.hash);
    expect(boundTxResponse.status).toEqual("SUCCESS");

    const unboundRawTx = await shelter.unbound_aid({
      recipient: bob.rawPublicKey(),
      token: tokenContractId,
    });

    const unboundBuildTx = unboundRawTx.built!;

    unboundBuildTx.sign(stewardKeypair);

    const unboundTx = await rpcServer.sendTransaction(unboundBuildTx);
    console.log("[UNBOUND AID HASH]:", unboundTx.hash);

    const unboundTxResponse = await rpcServer.pollTransaction(unboundTx.hash);
    expect(unboundTxResponse.status).toEqual("SUCCESS");

    const at: any = await _sac(bob.publicKey()).transfer({
      from: shelterAddress,
      to: merch,
      amount: BigInt(amount),
    });
    await _sign(at, { keypair: bob });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);

    expect(() => rpc.assembleTransaction(buildTx, simTx).build()).toThrow();
  }, 5000000);

  test("transfer failed, expirated aid", async () => {
    const bob = await _randomKeyPair();

    const tx = await shelter.bound_aid({
      recipient: bob.rawPublicKey(),
      token: tokenContractId,
      amount: BigInt(amount),
      expiration: BigInt(_invalidExpiration),
    });

    const boundBuildTx = tx.built!;

    boundBuildTx.sign(stewardKeypair);

    const boundTx = await rpcServer.sendTransaction(boundBuildTx);

    const boundTxResponse = await rpcServer.pollTransaction(boundTx.hash);
    expect(boundTxResponse.status).toEqual("SUCCESS");

    const at: any = await _sac(bob.publicKey()).transfer({
      from: shelterAddress,
      to: merch,
      amount: BigInt(amount),
    });
    await _sign(at, { keypair: bob });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);

    expect(() => rpc.assembleTransaction(buildTx, simTx).build()).toThrow();
  }, 5000000);

  test("steward withdraw from shelter sealed", async () => {
    console.log("--- STEWARD WITHDRAW FROM SHELTER SEALED ---");

    const bob = await _randomKeyPair();

    const rawUpdateReleaseKeyTx = await shelter.update_release_key({ steward_key: stewardKeypair.rawPublicKey() });
    const updateReleaseKeyBuildTx = rawUpdateReleaseKeyTx.built!;

    updateReleaseKeyBuildTx.sign(stewardKeypair);

    const updateReleaseKeyTx = await rpcServer.sendTransaction(updateReleaseKeyBuildTx);
    console.log("[UPDATE RELEASE KEY HASH]:", updateReleaseKeyTx.hash);

    const updateReleaseKeyResponse = await rpcServer.pollTransaction(updateReleaseKeyTx.hash);
    expect(updateReleaseKeyResponse.status).toEqual("SUCCESS");

    const tx = await shelter.bound_aid({
      recipient: bob.rawPublicKey(),
      token: tokenContractId,
      amount: BigInt(amount),
      expiration: BigInt(_validExpiration),
    });

    const boundBuildTx = tx.built!;

    boundBuildTx.sign(stewardKeypair);

    const boundTx = await rpcServer.sendTransaction(boundBuildTx);
    console.log("[BOUND AID HASH]:", boundTx.hash);

    const boundTxResponse = await rpcServer.pollTransaction(boundTx.hash);
    expect(boundTxResponse.status).toEqual("SUCCESS");

    const rawSealTx = await shelter.seal();
    const sealBuildTx = rawSealTx.built!;

    sealBuildTx.sign(stewardKeypair);

    const sealTx = await rpcServer.sendTransaction(sealBuildTx);
    console.log("[SEAL HASH]:", sealTx.hash);

    const sealTxResponse = await rpcServer.pollTransaction(sealTx.hash);
    expect(sealTxResponse.status).toEqual("SUCCESS");

    const at: any = await _sac(stewardKeypair.publicKey()).transfer({
      from: shelterAddress,
      to: merch,
      amount: BigInt(mintedTokensToShelter - amount),
    });
    await _sign(at, { keypair: stewardKeypair });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);
    const completeTx = rpc.assembleTransaction(buildTx, simTx).build();
    completeTx.sign(stewardKeypair);

    const sendTx = await rpcServer.sendTransaction(completeTx);
    console.log("[TRANSFER HASH]:", sendTx.hash);

    const txResponse = await rpcServer.pollTransaction(sendTx.hash);

    expect(txResponse.status).toEqual("SUCCESS");
  }, 5000000);
});
