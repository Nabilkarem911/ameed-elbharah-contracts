-- AlterTable
ALTER TABLE "companies" ADD COLUMN "apply_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "companies_apply_token_key" ON "companies"("apply_token");
