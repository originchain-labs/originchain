import { chainClient } from "./registry.js";
import { translateError, RpcUnavailableError } from "./errors.js";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 200;
export const DEFAULT_MAX_BLOCK_RANGE = 100_000n;

export interface GetLogsOptions {
  maxBlockRange?: bigint;
  onChunkSuccess?: (chunkToBlock: bigint, chunkLogs: any[]) => Promise<void>;
}

async function getLogsSingleChunk(params: any): Promise<any[]> {
  let attempt = 0;

  while (true) {
    attempt++;
    try {
      return await chainClient.getLogs(params);
    } catch (rawError) {
      const translated = translateError(rawError);

      if (translated instanceof RpcUnavailableError && attempt <= MAX_RETRIES) {
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(
          `[blockchain/events] Attempt ${attempt}/${MAX_RETRIES + 1} failed (${translated.message}). Retrying in ${backoffMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      throw translated;
    }
  }
}

export async function getLogs(params: any, options?: GetLogsOptions): Promise<any[]> {
  const { maxBlockRange = DEFAULT_MAX_BLOCK_RANGE, onChunkSuccess } = options || {};

  const fromBlock: bigint | null =
    typeof params.fromBlock === "bigint"
      ? params.fromBlock
      : typeof params.fromBlock === "number"
      ? BigInt(params.fromBlock)
      : null;

  const toBlock: bigint | null =
    typeof params.toBlock === "bigint"
      ? params.toBlock
      : typeof params.toBlock === "number"
      ? BigInt(params.toBlock)
      : null;

  if (fromBlock !== null && toBlock !== null && fromBlock <= toBlock && toBlock - fromBlock + 1n > maxBlockRange) {
    const allLogs: any[] = [];
    let currentFrom: bigint = fromBlock;

    while (currentFrom <= toBlock) {
      let currentTo: bigint = currentFrom + maxBlockRange - 1n;
      if (currentTo > toBlock) currentTo = toBlock;

      const chunkParams = { ...params, fromBlock: currentFrom, toBlock: currentTo };
      const chunkLogs = await getLogsSingleChunk(chunkParams);

      if (onChunkSuccess) {
        await onChunkSuccess(currentTo, chunkLogs);
      }

      allLogs.push(...chunkLogs);
      currentFrom = currentTo + 1n;
    }

    return allLogs;
  }

  const logs = await getLogsSingleChunk(params);
  if (onChunkSuccess && toBlock !== null) {
    await onChunkSuccess(toBlock, logs);
  }
  return logs;
}
