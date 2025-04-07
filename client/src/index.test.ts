import { Asset, BASE_FEE, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { AccountService, IssuedAssetId, NativeAssetId, SigningKeypair, SponsoringBuilder, Stellar, walletSdk } from "@stellar/typescript-wallet-sdk";
import crypto from "node:crypto";

describe('Testing Stellar Wallet SDK', () => {
  const fixedBytes = Buffer.alloc(32);
  const testPublicKey = 'GA5WUJ54Z23KILLCUOUNAKTPBVZWKMQVO4O6EQ5GHLAERIMLLHNCSKYH';
  const testSecretKey = 'SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSU2';
  const asset = new IssuedAssetId(
    'USDC',
    'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
  );
  let stellar: Stellar;
  let account: AccountService;

  const _fundedKeypair = async (): Promise<SigningKeypair> => {
    const keypair = account.createKeypair();
    await stellar.fundTestnetAccount(keypair.publicKey);
    return keypair;
  }

  const _addAnAssetTo = async (aKeypair: SigningKeypair): Promise<boolean> => {
    const txBuilder = await stellar.transaction({
      sourceAddress: aKeypair
    });

    const addAssetTx = txBuilder.addAssetSupport(asset).build();
    addAssetTx.sign(Keypair.fromSecret(aKeypair.secretKey));
    return await stellar.submitTransaction(addAssetTx);
  }

  beforeEach(() => {
    stellar = walletSdk.Wallet.TestNet().stellar();
    account = stellar.account();
  });

  describe('Keys and Accounts', () => {
    test('keys', () => {
      const keypair = account.createKeypair();

      expect(keypair.publicKey).toBeTruthy();
      expect(keypair.secretKey).toBeTruthy();
    });

    test('keys from random bytes', () => {
      const randomBytes = crypto.randomBytes(32);

      const keypair = account.createKeypairFromRandom(randomBytes);

      expect(keypair.publicKey).toBeTruthy();
      expect(keypair.secretKey).toBeTruthy();
    });

    test('keys from fixed random bytes', () => {
      const keypair = account.createKeypairFromRandom(fixedBytes);

      expect(keypair.publicKey).toEqual(testPublicKey);
      expect(keypair.secretKey).toEqual(testSecretKey);
    });

    test('import an account', () => {
      const keypair = Keypair.fromSecret(testSecretKey);

      expect(keypair.publicKey()).toEqual(testPublicKey);
    });

    test.skip('create account tx', async () => {
      const keypair = account.createKeypair();
      const anotherKeypair = account.createKeypair();
      await stellar.fundTestnetAccount(keypair.publicKey);
      const txBuilder = await stellar.transaction({
        sourceAddress: keypair
      });

      const tx = txBuilder.createAccount(anotherKeypair).build()
      tx.sign(Keypair.fromSecret(keypair.secretKey));

      const result = await stellar.submitTransaction(tx);

      expect(result).toEqual(true);
    }, 5000000);
  });

  describe('Assets (trustline)', () => {
    test.skip('add an asset to the account (trustline)', async () => {
      const keypair = await _fundedKeypair();

      const result = await _addAnAssetTo(keypair);

      expect(result).toEqual(true);
    }, 5000000);

    test.skip('add and remove an asset to the account (trustline)', async () => {
      const keypair = await _fundedKeypair();
      const txBuilder = await stellar.transaction({
        sourceAddress: keypair
      });

      const assetAdded = await _addAnAssetTo(keypair);

      expect(assetAdded).toEqual(true);

      // TODO: for some reason this failts on testnet (it doesn't try on mainnet...)
      const removeAssetTx = txBuilder.removeAssetSupport(asset).build();
      removeAssetTx.sign(Keypair.fromSecret(keypair.secretKey));

      const result = await stellar.submitTransaction(removeAssetTx);

      expect(result).toEqual(true);
    }, 5000000);
  });

  describe('Accesing blockchain data', () => {
    test.skip('transactions', async () => {
      const keypair = await _fundedKeypair();
      await _addAnAssetTo(keypair);

      const txs = await stellar.server.transactions().forAccount(keypair.publicKey).call();

      expect(txs).toEqual([]);
    }, 5000000);
  });

  describe('More transactions', () => {
    test.skip('swap', async () => {
      const keypair = await _fundedKeypair();
      await _addAnAssetTo(keypair);
      const txBuilder = await stellar.transaction({ sourceAddress: keypair });
      const tx = txBuilder.swap(new NativeAssetId(), asset, ".1").build();
      keypair.sign(tx);

      const result = await stellar.submitTransaction(tx);
      const balances = (await stellar.server.loadAccount(keypair.publicKey)).balances;
      const usdcBalance = balances.filter((balance: any) => balance.asset_code === 'USDC')[0].balance;

      expect(result).toBeTruthy();
      expect(parseFloat(usdcBalance)).toBeGreaterThan(0);
    }, 5000000);

    test('mixing things...', async () => {
      // Getting some USDC...
      const keypair = await _fundedKeypair();
      await _addAnAssetTo(keypair);
      const txBuilder = await stellar.transaction({ sourceAddress: keypair });
      const swapTx = txBuilder.swap(new NativeAssetId(), asset, ".1").build();
      keypair.sign(swapTx);

      const swapResult = await stellar.submitTransaction(swapTx).then(_ => { console.log('swap OK!'); return _; });

      // Sponsor account creation
      const sponsoredKeypair = account.createKeypair();

      const sponsorAccountCreationTx = txBuilder.sponsoring(
        keypair,
        (bldr: SponsoringBuilder) => bldr.createAccount(sponsoredKeypair),
        sponsoredKeypair
      ).build();
      keypair.sign(sponsorAccountCreationTx);
      sponsoredKeypair.sign(sponsorAccountCreationTx);

      const accountCreationResult = await stellar.submitTransaction(sponsorAccountCreationTx).then(_ => { console.log('Sponsored Account OK!'); return _; });

      // Sponsor trustuline creation of a sponsored account
      const generalAsset = new Asset('USDC',
        'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
      );
      const sponsorAccount = await stellar.server.loadAccount(keypair.publicKey);
      const tx = new TransactionBuilder(sponsorAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET
      })
        .addOperation(Operation.beginSponsoringFutureReserves({ sponsoredId: sponsoredKeypair.publicKey }))
        .addOperation(Operation.changeTrust({
          asset: generalAsset,
          source: sponsoredKeypair.publicKey
        }))
        .addOperation(Operation.endSponsoringFutureReserves({ source: sponsoredKeypair.publicKey }))
        .setTimeout(180)
        .build();

      tx.sign(Keypair.fromSecret(keypair.secretKey));
      tx.sign(Keypair.fromSecret(sponsoredKeypair.secretKey));

      const addTrustlineResult = await stellar.server.submitTransaction(tx)
        .then(_ => { console.log('Added Trustline OK!'); return _; })
        .catch((err: any) => console.log('Error', err.response.data.extras));

      // Send USDC to an sponsored account
      const txBuilder2 = await stellar.transaction({ sourceAddress: keypair });
      const sendUSDCTx = txBuilder2.transfer(sponsoredKeypair.publicKey, asset, "0.1").build();
      keypair.sign(sendUSDCTx);

      const sendUSDCResult = await stellar.submitTransaction(sendUSDCTx)
        .then(_ => { console.log('USDC sended to an sponsored account OK!'); return _; })
        .catch((err: any) => console.log('Error', err.response.data.extras));

      // Send back the USDCs
      const txBuilder3 = await stellar.transaction({ sourceAddress: sponsoredKeypair });
      const innerSendBackTx = txBuilder3.transfer(keypair.publicKey, asset, '0.1').build();
      sponsoredKeypair.sign(innerSendBackTx);
      const feeBumpTx = stellar.makeFeeBump({ feeAddress: keypair, transaction: innerSendBackTx });
      keypair.sign(feeBumpTx);

      const sendBackUSDCResult = await stellar.submitTransaction(feeBumpTx)
        .then(_ => { console.log('USDC sent back OK!'); return _; })
        .catch((err: any) => console.log('Error', err));

      expect(swapResult && accountCreationResult && addTrustlineResult && sendUSDCResult && sendBackUSDCResult).toEqual(true);
    }, 5000000);
  });

  describe('Sponsorship', () => {
    test.skip('sponsoring a transaction', async () => {
      const sponsorKeypair = await _fundedKeypair();
      const sponsoredKeypair = await _fundedKeypair();
      const txBuilder = await stellar.transaction({ sourceAddress: sponsoredKeypair });
      const buildingFunction = (bldr: SponsoringBuilder) => bldr.addAssetSupport(asset);

      const tx = txBuilder.sponsoring(sponsorKeypair, buildingFunction).build();
      sponsoredKeypair.sign(tx);
      sponsorKeypair.sign(tx);

      const result = await stellar.submitTransaction(tx);

      expect(result).toEqual(true);
    }, 5000000);

    test.skip('sponsoring account creation', async () => {
      const sponsorKeypair = await _fundedKeypair();
      const sponsoredKeypair = account.createKeypair();
      const txBuilder = await stellar.transaction({ sourceAddress: sponsorKeypair });
      const buildingFunction = (bldr: SponsoringBuilder) => bldr.createAccount(sponsoredKeypair);

      const tx = txBuilder.sponsoring(sponsorKeypair, buildingFunction, sponsoredKeypair).build();
      sponsorKeypair.sign(tx);
      sponsoredKeypair.sign(tx);

      const result = await stellar.submitTransaction(tx);

      expect(result).toEqual(true);
    }, 5000000);
  });
});
