/*
  Warnings:

  - You are about to drop the `_ServiceToServiceRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_posts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceId` to the `service_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ServiceToServiceRequest" DROP CONSTRAINT "_ServiceToServiceRequest_A_fkey";

-- DropForeignKey
ALTER TABLE "_ServiceToServiceRequest" DROP CONSTRAINT "_ServiceToServiceRequest_B_fkey";

-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_jobPostId_fkey";

-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_userId_fkey";

-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ServiceToServiceRequest";

-- DropTable
DROP TABLE "job_applications";

-- DropTable
DROP TABLE "job_posts";

-- CreateTable
CREATE TABLE "jobApplications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobPostId" TEXT,
    "cvUrl" TEXT NOT NULL,
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobApplications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobPosts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "location" TEXT DEFAULT 'Remote',
    "serviceType" TEXT NOT NULL,
    "vacancy" INTEGER NOT NULL DEFAULT 1,
    "salaryRange" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobApplications_jobPostId_idx" ON "jobApplications"("jobPostId");

-- CreateIndex
CREATE INDEX "jobApplications_status_idx" ON "jobApplications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "jobApplications_userId_jobPostId_key" ON "jobApplications"("userId", "jobPostId");

-- CreateIndex
CREATE INDEX "jobPosts_serviceType_idx" ON "jobPosts"("serviceType");

-- CreateIndex
CREATE INDEX "jobPosts_isActive_idx" ON "jobPosts"("isActive");

-- AddForeignKey
ALTER TABLE "jobApplications" ADD CONSTRAINT "jobApplications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobApplications" ADD CONSTRAINT "jobApplications_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "jobPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
