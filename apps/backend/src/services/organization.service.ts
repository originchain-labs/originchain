import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { createPublicClient, http, parseAbiItem } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const chainClient = createPublicClient({ chain: arbitrumSepolia, transport: http(process.env.RPC_URL) });

const CREATOR_REGISTRY_DEPLOYMENT_BLOCK = 294428245n;
const ASSET_REGISTRY_DEPLOYMENT_BLOCK = 295920616n;

const creatorRegisteredEvent = parseAbiItem(
    "event CreatorRegistered(address indexed creator, string profile_cid, uint64 timestamp)"
);

const assetRegisteredEvent = parseAbiItem(
    "event AssetRegistered(bytes32 indexed hash, address indexed creator, string ipfs_cid, uint64 timestamp)"
);

const reviewSubmittedEvent = parseAbiItem(
    "event ReviewSubmitted(bytes32 indexed asset_hash, address indexed reviewer, uint8 rating, uint64 timestamp)"
);

export async function createOrganization(ownerId: string, name: string) {
  const existing = await prisma.organization.findUnique({ where: { ownerId } });
  if (existing) throw new Error("ALREADY_OWNS_ORGANIZATION");
  return prisma.organization.create({ data: { name, ownerId } });
}

export async function getOrganization(id: string) {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: { members: { select: { id: true, displayName: true, walletAddress: true } } },
  });
  if (!org) throw new Error("ORGANIZATION_NOT_FOUND");
  return org;
}

export async function getMyOrganizations(requesterId: string) {
  return prisma.organization.findMany({ where: { ownerId: requesterId } });
}

export async function updateOrganization(id: string, requesterId: string, name: string) {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw new Error("ORGANIZATION_NOT_FOUND");
  if (org.ownerId !== requesterId) throw new Error("FORBIDDEN");
  return prisma.organization.update({ where: { id }, data: { name } });
}

export async function getAdminAnalytics() {
  const toBlock = await chainClient.getBlockNumber();

  const [creatorLogs, assetLogs, reviewLogs] = await Promise.all([
    chainClient.getLogs({
      address: CONTRACT_ADDRESSES.arbitrumSepolia.creatorRegistry as `0x${string}`,
      event: creatorRegisteredEvent,
      fromBlock: CREATOR_REGISTRY_DEPLOYMENT_BLOCK,
      toBlock,
    }),
    chainClient.getLogs({
      address: CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`,
      event: assetRegisteredEvent,
      fromBlock: ASSET_REGISTRY_DEPLOYMENT_BLOCK,
      toBlock,
    }),
    chainClient.getLogs({
      address: CONTRACT_ADDRESSES.arbitrumSepolia.reviewRegistry as `0x${string}`,
      event: reviewSubmittedEvent,
      fromBlock: ASSET_REGISTRY_DEPLOYMENT_BLOCK,
      toBlock,
    }),
  ]);

  return {
    totalCreators: creatorLogs.length,
    totalAssets: assetLogs.length,
    totalReviews: reviewLogs.length,
  };
}
