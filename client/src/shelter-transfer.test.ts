import { BASE_FEE, contract, hash, Keypair, Networks, rpc, xdr } from "@stellar/stellar-sdk";
import { Stellar, walletSdk } from "@stellar/typescript-wallet-sdk";
import { SAC } from "./sac";
import { Shelter } from "./shelter";

describe('shelter indirect invocation', () => {
  const amount = 1;
  const aliceSecret = 'SCG4Q5PANQOYOQELESMIYLPIERGFU4X25R7WUVC6JH43KUX5QOIWZYBQ';
  const aliceKeyPair = Keypair.fromSecret(aliceSecret);
  const tokenContractId = 'CAAIDCXSU7N4YYKCJ4WADUYAYL2NB53JFZ5N7PA7PQMKU4OCEOFSVYCE';
  const smartAccount = 'CDYLIWVXSXTK2LPHXJTWGDLEYL4W6RAKI7MIV2BUAUR4KGJYXGX4RUV4';
  const recipient = 'GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM';
  const rpcUrl = 'https://soroban-rpc.testnet.stellar.gateway.fm';
  const rpcServer = new rpc.Server(rpcUrl);
  let stellar: Stellar;

  const _signAuthEntry = async (entry: xdr.SorobanAuthorizationEntry,
    options: {
      keypair: Keypair,
    }) => {
    const credentials = entry.credentials().address();

    let expiration = credentials.signatureExpirationLedger()

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
        invocation: entry.rootInvocation()
      })
    );

    const payload = hash(preimage.toXDR());

    const signature = options.keypair.sign(payload);

    const shelterSignature = {
      public_key: options.keypair.rawPublicKey(),
      signature: signature,
    };

    const shelter = new Shelter({
      contractId: smartAccount,
      networkPassphrase: Networks.TESTNET,
      rpcUrl: rpcUrl
    });
    const scValType = xdr.ScSpecTypeDef.scSpecTypeUdt(new xdr.ScSpecTypeUdt({ name: 'RecipientSignature' }));

    const scVal = shelter.spec.nativeToScVal(shelterSignature, scValType);

    switch (credentials.signature().switch().name) {
      case 'scvVoid':
        console.log('add in void');
        credentials.signature(scVal);
        break;
      case 'scvVec':
        // Add the new signature to the existing map
        // TODO: ?
        // credentials.signature().vec()?.[0].map()?.push(scVal)
        console.log('add vec?');
        // Order the map by key
        // Not using Buffer.compare because Symbols are 9 bytes and unused bytes _append_ 0s vs prepending them, which is too bad
        credentials.signature().vec()?.[0].map()?.sort((a, b) => {
          return (
            a.key().vec()![0].sym() +
            a.key().vec()![1].toXDR().join('')
          ).localeCompare(
            b.key().vec()![0].sym() +
            b.key().vec()![1].toXDR().join('')
          )
        })
        break;
      default:
        throw new Error('Unsupported signature')
    }

    return entry;
  };

  const _sign = async (txn: any, options: { keypair: Keypair }) => {
    await txn.signAuthEntries({
      address: smartAccount,
      authorizeEntry: (entry: any) => {
        const clone = xdr.SorobanAuthorizationEntry.fromXDR(entry.toXDR())
        return _signAuthEntry(clone, options)
      },
    });

    return txn;
  };

  beforeEach(() => {
    stellar = walletSdk.Wallet.TestNet().stellar();
  })

  test('transfer', async () => {
    const sac = new SAC({ networkPassphrase: Networks.TESTNET, rpcUrl })
      .getSACClient(
        tokenContractId,
        aliceKeyPair.publicKey(),
      );
    const at: any = await sac.transfer({
      from: smartAccount,
      to: recipient,
      amount: BigInt(amount),
    });
    await _sign(at, { keypair: aliceKeyPair });

    const buildTx = at.built!;
    const simTx: any = await rpcServer.simulateTransaction(buildTx);
    const completeTx = rpc.assembleTransaction(buildTx, simTx).build();
    completeTx.sign(aliceKeyPair);

    const sendTx = await rpcServer.sendTransaction(completeTx);
    console.log('hash', sendTx.hash);

    const txResponse = await rpcServer.pollTransaction(sendTx.hash);

    expect(txResponse.status).toEqual("SUCCESS");
  }, 5000000);
});
