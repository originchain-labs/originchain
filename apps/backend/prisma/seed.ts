import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:dhyey104%40@127.0.0.1:5432/originchain?schema=public";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("[seed] Starting local dev database seed...");

  // Idempotent seeding using upsert keyed by unique walletAddress for creators
  const creator1 = await prisma.creator.upsert({
    where: { walletAddress: "0x1111111111111111111111111111111111111111" },
    create: {
      walletAddress: "0x1111111111111111111111111111111111111111",
      displayName: "Dev Sample Creator Alice",
      bio: "Local dev sample creator profile for UI/UX testing",
      avatarCid: "bafkreihsampledevavatarcid111111111111111111111111111111",
      onChainConfirmed: false, // Sample dev data only, not on-chain registered
    },
    update: {
      displayName: "Dev Sample Creator Alice",
      bio: "Local dev sample creator profile for UI/UX testing",
    },
  });

  const creator2 = await prisma.creator.upsert({
    where: { walletAddress: "0x2222222222222222222222222222222222222222" },
    create: {
      walletAddress: "0x2222222222222222222222222222222222222222",
      displayName: "Dev Sample Creator Bob",
      bio: "Local dev sample 3D artist profile for UI testing",
      avatarCid: "bafkreihsampledevavatarcid222222222222222222222222222222",
      onChainConfirmed: false, // Sample dev data only
    },
    update: {
      displayName: "Dev Sample Creator Bob",
      bio: "Local dev sample 3D artist profile for UI testing",
    },
  });

  // Idempotent seeding using upsert keyed by unique id for assets
  const asset1 = await prisma.asset.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      creatorId: creator1.id,
      title: "Dev Sample Digital Sunset Artwork",
      description: "Sample digital artwork for local frontend testing",
      contentHash: "0x1111111111111111111111111111111111111111111111111111111111111111",
      ipfsCid: "bafkreihsampledevassetcid11111111111111111111111111111111",
      metadataCid: "bafkreihsampledevmetadatacid11111111111111111111111111111",
      onChainConfirmed: false, // Sample dev data only
    },
    update: {
      title: "Dev Sample Digital Sunset Artwork",
      description: "Sample digital artwork for local frontend testing",
    },
  });

  const asset2 = await prisma.asset.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      creatorId: creator2.id,
      title: "Dev Sample 3D Sculpture Model",
      description: "Sample 3D model asset for local testing",
      contentHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
      ipfsCid: "bafkreihsampledevassetcid22222222222222222222222222222222",
      metadataCid: "bafkreihsampledevmetadatacid22222222222222222222222222222",
      onChainConfirmed: false, // Sample dev data only
    },
    update: {
      title: "Dev Sample 3D Sculpture Model",
      description: "Sample 3D model asset for local testing",
    },
  });

  console.log(`[seed] Seed completed successfully:`);
  console.log(`  - Seeding Creator 1: ${creator1.displayName} (${creator1.id})`);
  console.log(`  - Seeding Creator 2: ${creator2.displayName} (${creator2.id})`);
  console.log(`  - Seeding Asset 1: ${asset1.title} (${asset1.id})`);
  console.log(`  - Seeding Asset 2: ${asset2.title} (${asset2.id})`);

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("[seed] Seed failed:", err);
  process.exit(1);
});
