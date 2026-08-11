import { chainClient } from "./registry.js";
import { translateError, RpcUnavailableError } from "./errors.js";
import type { ReadContractParameters } from "viem";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 200;

export async function readContract<TParams extends ReadContractParameters>(
  params: TParams
): Promise<any> {
  let attempt = 0;

  while (true) {
    attempt++;
    try {
      return await chainClient.readContract(params as any);
    } catch (rawError) {
      const translated = translateError(rawError);

      if (translated instanceof RpcUnavailableError && attempt <= MAX_RETRIES) {
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(
          `[blockchain/read] Attempt ${attempt}/${MAX_RETRIES + 1} failed (${translated.message}). Retrying in ${backoffMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      throw translated;
    }
  }
}
