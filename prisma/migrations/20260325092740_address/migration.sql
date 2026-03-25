/*
  Warnings:

  - Added the required column `activePhone` to the `service_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceAddress` to the `service_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDescription` to the `service_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN     "activePhone" TEXT NOT NULL,
ADD COLUMN     "serviceAddress" TEXT NOT NULL,
ADD COLUMN     "serviceDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address" TEXT;
