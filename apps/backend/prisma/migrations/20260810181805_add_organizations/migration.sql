-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "walletAddress" VARCHAR(42),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_ownerId_key" ON "organizations"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_walletAddress_key" ON "organizations"("walletAddress");

-- AddForeignKey
ALTER TABLE "creators" ADD CONSTRAINT "creators_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "creators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
