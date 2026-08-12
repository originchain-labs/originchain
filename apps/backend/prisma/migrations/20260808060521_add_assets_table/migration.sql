-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "contentHash" VARCHAR(66) NOT NULL,
    "ipfsCid" VARCHAR(100) NOT NULL,
    "metadataCid" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "aiGeneratedFlag" BOOLEAN NOT NULL DEFAULT false,
    "registeredAt" TIMESTAMP(3),
    "txHash" VARCHAR(66),
    "onChainConfirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_contentHash_key" ON "assets"("contentHash");

-- CreateIndex
CREATE INDEX "assets_contentHash_idx" ON "assets"("contentHash");

-- CreateIndex
CREATE INDEX "assets_creatorId_idx" ON "assets"("creatorId");

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "creators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
