import { Buffer } from "buffer";
import { contract } from "@stellar/stellar-sdk";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

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
  expiration: contract.i128;
}

export type DataKey =
  | { tag: "Aid"; values: readonly [AidDataKey] }
  | { tag: "AssignedAid"; values: readonly [string] }
  | { tag: "Steward"; values: void };

export const Errors = {
  1: { message: "NotEnoughBalance" },

  2: { message: "InvalidAction" },

  3: { message: "NotEnoughAid" },

  4: { message: "InvalidContext" },
};

export interface Shelter {
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
  }) => Promise<contract.AssembledTransaction<string>>;

  /**
   * Construct and simulate a update_steward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_steward: (
    { new_steward }: { new_steward: string },
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
   * Construct and simulate a bound_aid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bound_aid: (
    {
      recipient,
      token,
      amount,
    }: { recipient: Buffer; token: string; amount: contract.i128 },
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
   * Construct and simulate a unbound_aid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unbound_aid: (
    { recipient, token }: { recipient: Buffer; token: string },
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
   * Construct and simulate a aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  aid_of: (
    { recipient, token }: { recipient: Buffer; token: string },
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
  ) => Promise<contract.AssembledTransaction<contract.i128>>;

  /**
   * Construct and simulate a assigned_aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  assigned_aid_of: (
    { token }: { token: string },
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
  ) => Promise<contract.AssembledTransaction<contract.i128>>;

  /**
   * Construct and simulate a available_aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  available_aid_of: (
    { token }: { token: string },
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
  ) => Promise<contract.AssembledTransaction<contract.i128>>;
}
export class Shelter extends contract.Client {
  static async deploy<T = Shelter>(
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
    return contract.Client.deploy({ steward }, options);
  }
  constructor(public readonly options: contract.ClientOptions) {
    super(
      new contract.Spec([
        "AAAAAQAAAAAAAAAAAAAABFBhc3MAAAACAAAAAAAAAApwdWJsaWNfa2V5AAAAAAPuAAAAIAAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAOdXBkYXRlX3N0ZXdhcmQAAAAAAAEAAAAAAAAAC25ld19zdGV3YXJkAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAJYm91bmRfYWlkAAAAAAAAAwAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAALdW5ib3VuZF9haWQAAAAAAgAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAACAAAAAAAAAAlyZWNpcGllbnQAAAAAAAPuAAAAIAAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAPYXNzaWduZWRfYWlkX29mAAAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAQYXZhaWxhYmxlX2FpZF9vZgAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAAARQYXNzAAAAAAAAAA1hdXRoX2NvbnRleHRzAAAAAAAD6gAAB9AAAAAHQ29udGV4dAAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAL",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQA",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAEAAAAAAAAADUludmFsaWRBY3Rpb24AAAAAAAACAAAAAAAAAAxOb3RFbm91Z2hBaWQAAAADAAAAAAAAAA5JbnZhbGlkQ29udGV4dAAAAAAABA==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    steward: this.txFromJSON<string>,
    update_steward: this.txFromJSON<null>,
    bound_aid: this.txFromJSON<null>,
    unbound_aid: this.txFromJSON<null>,
    aid_of: this.txFromJSON<contract.i128>,
    assigned_aid_of: this.txFromJSON<contract.i128>,
    available_aid_of: this.txFromJSON<contract.i128>,
  };
}
