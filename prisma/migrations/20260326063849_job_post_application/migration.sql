/*
  Warnings:

  - You are about to drop the `jobApplications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jobPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "jobApplications" DROP CONSTRAINT "jobApplications_jobPostId_fkey";

-- DropForeignKey
ALTER TABLE "jobApplications" DROP CONSTRAINT "jobApplications_userId_fkey";

-- DropTable
DROP TABLE "jobApplications";

-- DropTable
DROP TABLE "jobPosts";

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobPostId" TEXT,
    "cvUrl" TEXT NOT NULL,
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_posts" (
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

    CONSTRAINT "job_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_applications_jobPostId_idx" ON "job_applications"("jobPostId");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_userId_jobPostId_key" ON "job_applications"("userId", "jobPostId");

-- CreateIndex
CREATE INDEX "job_posts_serviceType_idx" ON "job_posts"("serviceType");

-- CreateIndex
CREATE INDEX "job_posts_isActive_idx" ON "job_posts"("isActive");

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
