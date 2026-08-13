-- AlterTable
ALTER TABLE "creators" ADD COLUMN     "reputationScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reputationUpdatedAt" TIMESTAMP(3);
