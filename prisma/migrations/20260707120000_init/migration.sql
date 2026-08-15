-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_applications" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "cr_number" TEXT NOT NULL,
    "vat_number" TEXT,
    "national_address" TEXT,
    "credit_limit" DECIMAL(65,30),
    "payment_terms" INTEGER,
    "bank_name" TEXT,
    "iban" TEXT,
    "signature_image" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credit_applications_cr_number_key" ON "credit_applications"("cr_number");

-- AddForeignKey
ALTER TABLE "credit_applications" ADD CONSTRAINT "credit_applications_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
