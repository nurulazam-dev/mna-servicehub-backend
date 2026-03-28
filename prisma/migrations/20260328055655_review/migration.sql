/*
  Warnings:

  - You are about to drop the `_ReviewToService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ReviewToService" DROP CONSTRAINT "_ReviewToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReviewToService" DROP CONSTRAINT "_ReviewToService_B_fkey";

-- DropIndex
DROP INDEX "services_isActive_idx";

-- DropIndex
DROP INDEX "services_name_idx";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "service_providers" ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_ReviewToService";

-- CreateIndex
CREATE INDEX "reviews_serviceId_idx" ON "reviews"("serviceId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
