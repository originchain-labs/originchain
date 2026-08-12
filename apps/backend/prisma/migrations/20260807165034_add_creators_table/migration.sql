-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL,
    "walletAddress" VARCHAR(42) NOT NULL,
    "displayName" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "avatarCid" VARCHAR(100),
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creators_walletAddress_key" ON "creators"("walletAddress");

-- CreateIndex
CREATE INDEX "creators_walletAddress_idx" ON "creators"("walletAddress");
