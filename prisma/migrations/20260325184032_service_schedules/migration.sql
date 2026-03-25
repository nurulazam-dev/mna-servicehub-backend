/*
  Warnings:

  - A unique constraint covering the columns `[providerId,scheduleDate,startTime]` on the table `service_schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endTime` to the `service_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotNumber` to the `service_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `service_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `service_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_schedules" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "slotNumber" INTEGER NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "service_schedules_providerId_scheduleDate_startTime_key" ON "service_schedules"("providerId", "scheduleDate", "startTime");
