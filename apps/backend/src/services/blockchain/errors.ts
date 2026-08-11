import {
  CallExecutionError,
  ContractFunctionRevertedError,
  HttpRequestError,
  TimeoutError,
  RpcError,
  AbiEncodingArrayLengthMismatchError,
} from "viem";

export class RpcUnavailableError extends Error {
  readonly isRetryable = true;
  constructor(message: string, public readonly originalError?: unknown) {
    super(`RPC Unavailable: ${message}`);
    this.name = "RpcUnavailableError";
  }
}

export class ContractRevertError extends Error {
  readonly isRetryable = false;
  constructor(message: string, public readonly originalError?: unknown) {
    super(`Contract Reverted: ${message}`);
    this.name = "ContractRevertError";
  }
}

export class DecodeError extends Error {
  readonly isRetryable = false;
  constructor(message: string, public readonly originalError?: unknown) {
    super(`Decode Error: ${message}`);
    this.name = "DecodeError";
  }
}

export function translateError(rawError: unknown): Error {
  if (
    rawError instanceof ContractFunctionRevertedError ||
    (rawError instanceof CallExecutionError && rawError.cause instanceof ContractFunctionRevertedError)
  ) {
    return new ContractRevertError(
      rawError instanceof Error ? rawError.message : "Contract execution reverted",
      rawError
    );
  }

  if (rawError instanceof AbiEncodingArrayLengthMismatchError) {
    return new DecodeError("ABI decoding mismatch", rawError);
  }

  if (
    rawError instanceof HttpRequestError ||
    rawError instanceof TimeoutError ||
    rawError instanceof RpcError
  ) {
    return new RpcUnavailableError(
      rawError instanceof Error ? rawError.message : "RPC request failed",
      rawError
    );
  }

  if (rawError instanceof Error) {
    const msg = rawError.message.toLowerCase();
    if (msg.includes("revert") || msg.includes("execution reverted")) {
      return new ContractRevertError(rawError.message, rawError);
    }
    if (
      msg.includes("fetch") ||
      msg.includes("econnrefused") ||
      msg.includes("timeout") ||
      msg.includes("network") ||
      msg.includes("502") ||
      msg.includes("503") ||
      msg.includes("429") ||
      msg.includes("http request failed")
    ) {
      return new RpcUnavailableError(rawError.message, rawError);
    }
    if (msg.includes("decode") || msg.includes("abi")) {
      return new DecodeError(rawError.message, rawError);
    }
  }

  return new RpcUnavailableError(
    rawError instanceof Error ? rawError.message : "Unknown RPC error",
    rawError
  );
}
