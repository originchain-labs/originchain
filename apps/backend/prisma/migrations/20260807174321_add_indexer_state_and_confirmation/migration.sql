-- AlterTable
ALTER TABLE "creators" ADD COLUMN     "onChainConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationTxHash" VARCHAR(66);

-- CreateTable
CREATE TABLE "indexer_state" (
    "id" TEXT NOT NULL,
    "indexerName" VARCHAR(100) NOT NULL,
    "lastBlock" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indexer_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indexer_state_indexerName_key" ON "indexer_state"("indexerName");
