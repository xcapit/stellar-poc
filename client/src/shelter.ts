import { Buffer } from "buffer";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { contract } from "@stellar/stellar-sdk";
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import {
  contract,
  rpc
} from '@stellar/stellar-sdk';
export * from '@stellar/stellar-sdk'
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
export type Gate =
  | { tag: "Open"; values: void }
  | { tag: "Guarded"; values: void }
  | { tag: "Sealed"; values: void };
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes



export type Gate = { tag: "Open", values: void } | { tag: "Guarded", values: void } | { tag: "Sealed", values: void };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export interface Pass {
  public_key: Buffer;
  signature: Buffer;
}


export interface AidDataKey {
  recipient: Buffer;
  token: string;
}


export interface AidValue {
  amount: contract.i128;
  expiration: contract.u64;
}

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
export type DataKey =
  | { tag: "Aid"; values: readonly [AidDataKey] }
  | { tag: "AssignedAid"; values: readonly [string] }
  | { tag: "Steward"; values: void }
  | { tag: "ReleaseKey"; values: void }
  | { tag: "GateState"; values: void };
=======
export type DataKey = { tag: "Aid", values: readonly [AidDataKey] } | { tag: "AssignedAid", values: readonly [string] } | { tag: "Steward", values: void } | { tag: "ReleaseKey", values: void } | { tag: "GateState", values: void } | { tag: "Recipient", values: void } | { tag: "ExpirationDate", values: void };
>>>>>>> Stashed changes
=======
export type DataKey = { tag: "Aid", values: readonly [AidDataKey] } | { tag: "AssignedAid", values: readonly [string] } | { tag: "Steward", values: void } | { tag: "ReleaseKey", values: void } | { tag: "GateState", values: void } | { tag: "Recipient", values: void } | { tag: "ExpirationDate", values: void };
>>>>>>> Stashed changes
=======
export type DataKey = { tag: "Aid", values: readonly [AidDataKey] } | { tag: "AssignedAid", values: readonly [string] } | { tag: "Steward", values: void } | { tag: "ReleaseKey", values: void } | { tag: "GateState", values: void } | { tag: "Recipient", values: void } | { tag: "ExpirationDate", values: void };
>>>>>>> Stashed changes
=======
export type DataKey = { tag: "Aid", values: readonly [AidDataKey] } | { tag: "AssignedAid", values: readonly [string] } | { tag: "Steward", values: void } | { tag: "ReleaseKey", values: void } | { tag: "GateState", values: void } | { tag: "Recipient", values: void } | { tag: "ExpirationDate", values: void };
>>>>>>> Stashed changes

export const Errors = {
  1: { message: "NotEnoughBalance" },

  2: { message: "InvalidAction" },

  3: { message: "NotEnoughAid" },

  4: { message: "InvalidContext" },

  5: { message: "ExpiredAid" },

  6: { message: "ShelterGuarded" },

  7: { message: "ShelterSealed" },
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
};

export interface Shelter {
  /**
   * Construct and simulate a update_release_key transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
=======

  8: { message: "InvalidRecipient" }
}

export interface Shelter {
  /**
   * Construct and simulate a steward transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
>>>>>>> Stashed changes
=======

  8: { message: "InvalidRecipient" }
}

export interface Shelter {
  /**
   * Construct and simulate a steward transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
>>>>>>> Stashed changes
=======

  8: { message: "InvalidRecipient" }
}

export interface Shelter {
  /**
   * Construct and simulate a steward transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
>>>>>>> Stashed changes
   */
  update_release_key: (
    { steward_key }: { steward_key: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<contract.AssembledTransaction<null>>;

  /**
   * Construct and simulate a open transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  open: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
<<<<<<< Updated upstream
     */
    simulate?: boolean;
<<<<<<< Updated upstream
  }) => Promise<contract.AssembledTransaction<null>>;

  /**
   * Construct and simulate a guard transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  guard: (options?: {
=======
  }) => Promise<contract.AssembledTransaction<string>>

  /**
   * Construct and simulate a expiration_date transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  expiration_date: (options?: {
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
<<<<<<< Updated upstream
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>;

  /**
   * Construct and simulate a seal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  seal: (options?: {
=======
=======
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<string>>

  /**
   * Construct and simulate a expiration_date transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  expiration_date: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
>>>>>>> Stashed changes
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<contract.u64>>

  /**
   * Construct and simulate a recipient transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  recipient: (options?: {
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;
<<<<<<< Updated upstream
<<<<<<< Updated upstream

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>;

  /**
   * Construct and simulate a steward_key transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  steward_key: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
<<<<<<< Updated upstream
  }) => Promise<contract.AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a steward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
=======

  8: { message: "InvalidRecipient" }
}

export interface Shelter {
  /**
   * Construct and simulate a steward transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
>>>>>>> Stashed changes
   */
  steward: (options?: {
=======
  }) => Promise<contract.AssembledTransaction<string>>

  /**
   * Construct and simulate a expiration_date transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  expiration_date: (options?: {
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
<<<<<<< Updated upstream
  }) => Promise<contract.AssembledTransaction<string>>

  /**
   * Construct and simulate a expiration_date transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  expiration_date: (options?: {
=======
  }) => Promise<contract.AssembledTransaction<contract.u64>>

  /**
   * Construct and simulate a recipient transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  recipient: (options?: {
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;
<<<<<<< Updated upstream

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<contract.u64>>

  /**
   * Construct and simulate a recipient transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
<<<<<<< Updated upstream
  bound_aid: (
    {
      recipient,
      token,
      amount,
      expiration,
    }: { recipient: Buffer; token: string; amount: contract.i128; expiration: contract.u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<Buffer>>

  /**
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
   * Construct and simulate a unbound_aid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unbound_aid: (
    { recipient, token }: { recipient: Buffer; token: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;
=======
  recipient: (options?: {
=======
   * Construct and simulate a update_release_key transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_release_key: ({ steward_key }: { steward_key: Buffer }, options?: {
>>>>>>> Stashed changes
=======
   * Construct and simulate a update_release_key transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_release_key: ({ steward_key }: { steward_key: Buffer }, options?: {
>>>>>>> Stashed changes
=======
   * Construct and simulate a update_release_key transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_release_key: ({ steward_key }: { steward_key: Buffer }, options?: {
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  }) => Promise<contract.AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a update_release_key transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_release_key: ({ steward_key }: { steward_key: Buffer }, options?: {
=======
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a open transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  open: (options?: {
>>>>>>> Stashed changes
=======
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a open transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  open: (options?: {
=======
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a open transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  open: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a guard transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  guard: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a seal transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  seal: (options?: {
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;
<<<<<<< Updated upstream

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a guard transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  guard: (options?: {
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;
<<<<<<< Updated upstream

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<contract.AssembledTransaction<AidValue>>;
=======
=======
>>>>>>> Stashed changes
    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>
<<<<<<< Updated upstream
>>>>>>> Stashed changes

  /**
   * Construct and simulate a open transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  open: (options?: {
=======

  /**
   * Construct and simulate a guard transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  guard: (options?: {
>>>>>>> Stashed changes
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
<<<<<<< Updated upstream
   * Construct and simulate a guard transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  guard: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
=======
>>>>>>> Stashed changes
   * Construct and simulate a seal transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  seal: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a aid_of transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  aid_of: ({ token }: { token: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<contract.i128>>

=======

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a seal transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  seal: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a aid_of transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  aid_of: ({ token }: { token: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<contract.i128>>

>>>>>>> Stashed changes
=======

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a aid_of transaction. Returns an `contract.AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  aid_of: ({ token }: { token: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the contract.AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<contract.AssembledTransaction<contract.i128>>

>>>>>>> Stashed changes
}
export class Shelter extends contract.Client {
  static async deploy<T = Shelter>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { steward, recipient, expiration_date }: { steward: string, recipient: Buffer, expiration_date: contract.u64 },
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: contract.MethodOptions &
      Omit<contract.ClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<contract.AssembledTransaction<T>> {
    return contract.Client.deploy({ steward, recipient, expiration_date }, options)
  }
  constructor(public readonly options: contract.ClientOptions) {
    super(
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      new contract.Spec([
        "AAAAAgAAAAAAAAAAAAAABEdhdGUAAAADAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAAB0d1YXJkZWQAAAAAAAAAAAAAAAAGU2VhbGVkAAA=",
        "AAAAAQAAAAAAAAAAAAAABFBhc3MAAAACAAAAAAAAAApwdWJsaWNfa2V5AAAAAAPuAAAAIAAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAASdXBkYXRlX3JlbGVhc2Vfa2V5AAAAAAABAAAAAAAAAAtzdGV3YXJkX2tleQAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAEb3BlbgAAAAAAAAAA",
        "AAAAAAAAAAAAAAAFZ3VhcmQAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAEc2VhbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAALc3Rld2FyZF9rZXkAAAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAOdXBkYXRlX3N0ZXdhcmQAAAAAAAEAAAAAAAAAC25ld19zdGV3YXJkAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAJYm91bmRfYWlkAAAAAAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAALdW5ib3VuZF9haWQAAAAAAgAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAACAAAAAAAAAAlyZWNpcGllbnQAAAAAAAPuAAAAIAAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAB9AAAAAIQWlkVmFsdWU=",
        "AAAAAAAAAAAAAAAPYXNzaWduZWRfYWlkX29mAAAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAQYXZhaWxhYmxlX2FpZF9vZgAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAAARQYXNzAAAAAAAAAA1hdXRoX2NvbnRleHRzAAAAAAAD6gAAB9AAAAAHQ29udGV4dAAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQAAAAAAAAAAAAAAAAKUmVsZWFzZUtleQAAAAAAAAAAAAAAAAAJR2F0ZVN0YXRlAAAA",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABwAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAEAAAAAAAAADUludmFsaWRBY3Rpb24AAAAAAAACAAAAAAAAAAxOb3RFbm91Z2hBaWQAAAADAAAAAAAAAA5JbnZhbGlkQ29udGV4dAAAAAAABAAAAAAAAAAKRXhwaXJlZEFpZAAAAAAABQAAAAAAAAAOU2hlbHRlckd1YXJkZWQAAAAAAAYAAAAAAAAADVNoZWx0ZXJTZWFsZWQAAAAAAAAH",
      ]),
=======
      new contract.Spec(["AAAAAgAAAAAAAAAAAAAABEdhdGUAAAADAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAAB0d1YXJkZWQAAAAAAAAAAAAAAAAGU2VhbGVkAAA=",
        "AAAAAQAAAAAAAAAAAAAABFBhc3MAAAACAAAAAAAAAApwdWJsaWNfa2V5AAAAAAPuAAAAIAAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAMAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAAD2V4cGlyYXRpb25fZGF0ZQAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAASdXBkYXRlX3JlbGVhc2Vfa2V5AAAAAAABAAAAAAAAAAtzdGV3YXJkX2tleQAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAEb3BlbgAAAAAAAAAA",
        "AAAAAAAAAAAAAAAFZ3VhcmQAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAEc2VhbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAAARQYXNzAAAAAAAAAA1hdXRoX2NvbnRleHRzAAAAAAAD6gAAB9AAAAAHQ29udGV4dAAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQAAAAAAAAAAAAAAAAKUmVsZWFzZUtleQAAAAAAAAAAAAAAAAAJR2F0ZVN0YXRlAAAAAAAAAAAAAAAAAAAJUmVjaXBpZW50AAAAAAAAAAAAAAAAAAAORXhwaXJhdGlvbkRhdGUAAA==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAEAAAAAAAAADUludmFsaWRBY3Rpb24AAAAAAAACAAAAAAAAAAxOb3RFbm91Z2hBaWQAAAADAAAAAAAAAA5JbnZhbGlkQ29udGV4dAAAAAAABAAAAAAAAAAKRXhwaXJlZEFpZAAAAAAABQAAAAAAAAAOU2hlbHRlckd1YXJkZWQAAAAAAAYAAAAAAAAADVNoZWx0ZXJTZWFsZWQAAAAAAAAHAAAAAAAAABBJbnZhbGlkUmVjaXBpZW50AAAACA=="]),
>>>>>>> Stashed changes
=======
      new contract.Spec(["AAAAAgAAAAAAAAAAAAAABEdhdGUAAAADAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAAB0d1YXJkZWQAAAAAAAAAAAAAAAAGU2VhbGVkAAA=",
        "AAAAAQAAAAAAAAAAAAAABFBhc3MAAAACAAAAAAAAAApwdWJsaWNfa2V5AAAAAAPuAAAAIAAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAMAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAAD2V4cGlyYXRpb25fZGF0ZQAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAASdXBkYXRlX3JlbGVhc2Vfa2V5AAAAAAABAAAAAAAAAAtzdGV3YXJkX2tleQAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAEb3BlbgAAAAAAAAAA",
        "AAAAAAAAAAAAAAAFZ3VhcmQAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAEc2VhbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAAARQYXNzAAAAAAAAAA1hdXRoX2NvbnRleHRzAAAAAAAD6gAAB9AAAAAHQ29udGV4dAAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQAAAAAAAAAAAAAAAAKUmVsZWFzZUtleQAAAAAAAAAAAAAAAAAJR2F0ZVN0YXRlAAAAAAAAAAAAAAAAAAAJUmVjaXBpZW50AAAAAAAAAAAAAAAAAAAORXhwaXJhdGlvbkRhdGUAAA==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAEAAAAAAAAADUludmFsaWRBY3Rpb24AAAAAAAACAAAAAAAAAAxOb3RFbm91Z2hBaWQAAAADAAAAAAAAAA5JbnZhbGlkQ29udGV4dAAAAAAABAAAAAAAAAAKRXhwaXJlZEFpZAAAAAAABQAAAAAAAAAOU2hlbHRlckd1YXJkZWQAAAAAAAYAAAAAAAAADVNoZWx0ZXJTZWFsZWQAAAAAAAAHAAAAAAAAABBJbnZhbGlkUmVjaXBpZW50AAAACA=="]),
>>>>>>> Stashed changes
=======
      new contract.Spec(["AAAAAgAAAAAAAAAAAAAABEdhdGUAAAADAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAAB0d1YXJkZWQAAAAAAAAAAAAAAAAGU2VhbGVkAAA=",
        "AAAAAQAAAAAAAAAAAAAABFBhc3MAAAACAAAAAAAAAApwdWJsaWNfa2V5AAAAAAPuAAAAIAAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAMAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAAD2V4cGlyYXRpb25fZGF0ZQAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAASdXBkYXRlX3JlbGVhc2Vfa2V5AAAAAAABAAAAAAAAAAtzdGV3YXJkX2tleQAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAEb3BlbgAAAAAAAAAA",
        "AAAAAAAAAAAAAAAFZ3VhcmQAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAEc2VhbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAAARQYXNzAAAAAAAAAA1hdXRoX2NvbnRleHRzAAAAAAAD6gAAB9AAAAAHQ29udGV4dAAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQAAAAAAAAAAAAAAAAKUmVsZWFzZUtleQAAAAAAAAAAAAAAAAAJR2F0ZVN0YXRlAAAAAAAAAAAAAAAAAAAJUmVjaXBpZW50AAAAAAAAAAAAAAAAAAAORXhwaXJhdGlvbkRhdGUAAA==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAEAAAAAAAAADUludmFsaWRBY3Rpb24AAAAAAAACAAAAAAAAAAxOb3RFbm91Z2hBaWQAAAADAAAAAAAAAA5JbnZhbGlkQ29udGV4dAAAAAAABAAAAAAAAAAKRXhwaXJlZEFpZAAAAAAABQAAAAAAAAAOU2hlbHRlckd1YXJkZWQAAAAAAAYAAAAAAAAADVNoZWx0ZXJTZWFsZWQAAAAAAAAHAAAAAAAAABBJbnZhbGlkUmVjaXBpZW50AAAACA=="]),
>>>>>>> Stashed changes
=======
      new contract.Spec(["AAAAAgAAAAAAAAAAAAAABEdhdGUAAAADAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAAB0d1YXJkZWQAAAAAAAAAAAAAAAAGU2VhbGVkAAA=",
        "AAAAAQAAAAAAAAAAAAAABFBhc3MAAAACAAAAAAAAAApwdWJsaWNfa2V5AAAAAAPuAAAAIAAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAMAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAAD2V4cGlyYXRpb25fZGF0ZQAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAASdXBkYXRlX3JlbGVhc2Vfa2V5AAAAAAABAAAAAAAAAAtzdGV3YXJkX2tleQAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAEb3BlbgAAAAAAAAAA",
        "AAAAAAAAAAAAAAAFZ3VhcmQAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAEc2VhbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAAARQYXNzAAAAAAAAAA1hdXRoX2NvbnRleHRzAAAAAAAD6gAAB9AAAAAHQ29udGV4dAAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQAAAAAAAAAAAAAAAAKUmVsZWFzZUtleQAAAAAAAAAAAAAAAAAJR2F0ZVN0YXRlAAAAAAAAAAAAAAAAAAAJUmVjaXBpZW50AAAAAAAAAAAAAAAAAAAORXhwaXJhdGlvbkRhdGUAAA==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAEAAAAAAAAADUludmFsaWRBY3Rpb24AAAAAAAACAAAAAAAAAAxOb3RFbm91Z2hBaWQAAAADAAAAAAAAAA5JbnZhbGlkQ29udGV4dAAAAAAABAAAAAAAAAAKRXhwaXJlZEFpZAAAAAAABQAAAAAAAAAOU2hlbHRlckd1YXJkZWQAAAAAAAYAAAAAAAAADVNoZWx0ZXJTZWFsZWQAAAAAAAAHAAAAAAAAABBJbnZhbGlkUmVjaXBpZW50AAAACA=="]),
>>>>>>> Stashed changes
      options
    )
  }
  public readonly fromJSON = {
    update_release_key: this.txFromJSON<null>,
    open: this.txFromJSON<null>,
    guard: this.txFromJSON<null>,
    seal: this.txFromJSON<null>,
    steward_key: this.txFromJSON<Buffer>,
    steward: this.txFromJSON<string>,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    update_steward: this.txFromJSON<null>,
    bound_aid: this.txFromJSON<null>,
    unbound_aid: this.txFromJSON<null>,
    aid_of: this.txFromJSON<AidValue>,
    assigned_aid_of: this.txFromJSON<contract.i128>,
    available_aid_of: this.txFromJSON<contract.i128>,
  };
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    expiration_date: this.txFromJSON<contract.u64>,
    recipient: this.txFromJSON<Buffer>,
    update_release_key: this.txFromJSON<null>,
    open: this.txFromJSON<null>,
    guard: this.txFromJSON<null>,
    seal: this.txFromJSON<null>,
    iaid_of: this.txFromJSON<contract.i128>
  }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}
