import { Buffer } from "buffer";
import { contract } from '@stellar/stellar-sdk';

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export interface AidDataKey {
  recipient: string;
  token: string;
}

export interface AidValue {
  amount: contract.i128;
  expiration: contract.i128;
}

export type DataKey = { tag: "Aid", values: readonly [AidDataKey] } | { tag: "AssignedAid", values: readonly [string] } | { tag: "Steward", values: void };


export interface RecipientSignature {
  public_key: Buffer;
  signature: Buffer;
}

export const Errors = {
  1: { message: "AuthError" },

  2: { message: "NotEnoughBalance" },

  3: { message: "InvalidAction" }
}

export interface Client {
  /**
   * Construct and simulate a steward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  steward: (options?: {
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
  }) => Promise<contract.AssembledTransaction<string>>

  /**
   * Construct and simulate a update_steward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_steward: ({ new_steward }: { new_steward: string }, options?: {
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
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a bound_aid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bound_aid: ({ recipient, token, amount }: { recipient: string, token: string, amount: contract.i128 }, options?: {
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
  }) => Promise<contract.AssembledTransaction<null>>

  /**
   * Construct and simulate a aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  aid_of: ({ recipient, token }: { recipient: string, token: string }, options?: {
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
  }) => Promise<contract.AssembledTransaction<contract.i128>>

  /**
   * Construct and simulate a assigned_aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  assigned_aid_of: ({ token }: { token: string }, options?: {
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
  }) => Promise<contract.AssembledTransaction<contract.i128>>

  /**
   * Construct and simulate a available_aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  available_aid_of: ({ token }: { token: string }, options?: {
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
  }) => Promise<contract.AssembledTransaction<contract.i128>>

}
export class Shelter extends contract.Client {
  static async deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { steward }: { steward: string },
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
    return contract.Client.deploy({ steward }, options)
  }
  constructor(public readonly options: contract.ClientOptions) {
    super(
      new contract.Spec(["AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAOdXBkYXRlX3N0ZXdhcmQAAAAAAAEAAAAAAAAAC25ld19zdGV3YXJkAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAJYm91bmRfYWlkAAAAAAAAAwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAACAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAPYXNzaWduZWRfYWlkX29mAAAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAQYXZhaWxhYmxlX2FpZF9vZgAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAABJSZWNpcGllbnRTaWduYXR1cmUAAAAAAAAAAAANYXV0aF9jb250ZXh0cwAAAAAAA+oAAAfQAAAAB0NvbnRleHQAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAMU2hlbHRlckVycm9y",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAL",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQA",
        "AAAAAQAAAAAAAAAAAAAAElJlY2lwaWVudFNpZ25hdHVyZQAAAAAAAgAAAAAAAAAKcHVibGljX2tleQAAAAAD7gAAACAAAAAAAAAACXNpZ25hdHVyZQAAAAAAA+4AAABA",
        "AAAABAAAAAAAAAAAAAAADFNoZWx0ZXJFcnJvcgAAAAMAAAAAAAAACUF1dGhFcnJvcgAAAAAAAAEAAAAAAAAAEE5vdEVub3VnaEJhbGFuY2UAAAACAAAAAAAAAA1JbnZhbGlkQWN0aW9uAAAAAAAAAw=="]),
      options
    )
  }
  public readonly fromJSON = {
    steward: this.txFromJSON<string>,
    update_steward: this.txFromJSON<null>,
    bound_aid: this.txFromJSON<null>,
    aid_of: this.txFromJSON<contract.i128>,
    assigned_aid_of: this.txFromJSON<contract.i128>,
    available_aid_of: this.txFromJSON<contract.i128>
  }
}
