-- CreateSequence
CREATE SEQUENCE IF NOT EXISTS proof_id_seq START 1;

-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "proofId" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "assets_proofId_key" ON "assets"("proofId");
