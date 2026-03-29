/*
  Warnings:

  - You are about to alter the column `serviceCharge` on the `cost_breakdowns` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `productCost` on the `cost_breakdowns` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `additionalCost` on the `cost_breakdowns` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `totalAmount` on the `cost_breakdowns` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "cost_breakdowns" ALTER COLUMN "serviceCharge" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "productCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "additionalCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2);
