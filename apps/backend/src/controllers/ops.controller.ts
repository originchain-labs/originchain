import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { chainClient, CONTRACTS } from "../services/blockchain/registry.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

export async function getHealth(_req: Request, res: Response) {
  let dbStatus = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "error";
  }

  const storageConfigured = Boolean(process.env.PINATA_JWT && process.env.PINATA_JWT.trim() !== "");
  const storageStatus = storageConfigured ? "ok" : "error";
  const overallStatus = dbStatus === "ok" && storageStatus === "ok" ? "ok" : "error";

  const statusCode = overallStatus === "ok" ? 200 : 503;

  return res.status(statusCode).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    dependencies: {
      database: dbStatus,
      storage: storageStatus,
    },
  });
}

export async function getContracts(_req: Request, res: Response) {
  try {
    const latestChainBlock = await chainClient.getBlockNumber();

    const [creatorState, assetState] = await Promise.all([
      prisma.indexerState.findUnique({ where: { indexerName: "creator-registry-indexer" } }),
      prisma.indexerState.findUnique({ where: { indexerName: "asset-registry-indexer" } }),
    ]);

    const creatorLastBlock = creatorState ? creatorState.lastBlock : 294428245n;
    const assetLastBlock = assetState ? assetState.lastBlock : 295920616n;

    const latestIndexedBlock = creatorLastBlock < assetLastBlock ? creatorLastBlock : assetLastBlock;
    const lag = latestChainBlock > latestIndexedBlock ? latestChainBlock - latestIndexedBlock : 0n;
    const syncStatus = lag <= 10n ? "synced" : "lagging";

    return res.json({
      network: "Arbitrum Sepolia",
      contracts: {
        creatorRegistry: CONTRACTS.creatorRegistry.address,
        assetRegistry: CONTRACTS.assetRegistry.address,
        reviewRegistry: CONTRACTS.reviewRegistry.address,
        reputationManager: CONTRACTS.reputationManager.address,
      },
      latestChainBlock: Number(latestChainBlock),
      latestIndexedBlock: Number(latestIndexedBlock),
      syncStatus,
      indexers: {
        creatorRegistry: Number(creatorLastBlock),
        assetRegistry: Number(assetLastBlock),
      },
    });
  } catch (err) {
    console.error("[ops] getContracts failed:", err);
    return res.status(500).json({ error: { code: "UNKNOWN_ERROR", message: "Failed to fetch contract status" } });
  }
}
