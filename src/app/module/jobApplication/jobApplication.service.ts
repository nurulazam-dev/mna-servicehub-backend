import { prisma } from "../../lib/prisma";
import {
  IJobApplicationPayload,
  IUpdateJobApplicationPayload,
} from "./jobApplication.interface";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import {
  JobApplicationStatus,
  UserRole,
} from "../../../generated/prisma/enums";

const applyToJob = async (payload: IJobApplicationPayload) => {
  if (payload.userId && payload.jobPostId) {
    const isAlreadyApplied = await prisma.jobApplication.findUnique({
      where: {
        userId_jobPostId: {
          userId: payload.userId,
          jobPostId: payload.jobPostId,
        },
      },
    });

    if (isAlreadyApplied) {
      throw new AppError(
        status.BAD_REQUEST,
        "You have already applied for this job!",
      );
    }
  }

  return await prisma.jobApplication.create({
    data: payload,
    include: { jobPost: true },
  });
};

const getMyApplications = async (userId: string) => {
  return await prisma.jobApplication.findMany({
    where: { userId },
    include: {
      jobPost: {
        select: { title: true, serviceType: true, location: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getApplicationById = async (id: string, userId: string, role: string) => {
  const result = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      jobPost: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Application not found");
  }

  if (role !== UserRole.ADMIN && result.userId !== userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to view this application",
    );
  }

  return result;
};

const getAllApplicationsForAdmin = async () => {
  return await prisma.jobApplication.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      jobPost: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateApplication = async (
  id: string,
  payload: IUpdateJobApplicationPayload,
) => {
  const isApplicationExist = await prisma.jobApplication.findUnique({
    where: { id },
    include: { user: true, jobPost: true },
  });

  if (!isApplicationExist) {
    throw new AppError(status.NOT_FOUND, "Job application not found!");
  }

  return await prisma.$transaction(async (tx) => {
    const updatedApplication = await tx.jobApplication.update({
      where: { id },
      data: payload,
      include: {
        user: {
          select: {
            email: true,
            name: true,
            id: true,
            phone: true,
            address: true,
            isDeleted: true,
            emailVerified: true,
          },
        },
        jobPost: {
          select: {
            title: true,
            serviceType: true,
            salaryRange: true,
            deadline: true,
            isActive: true,
            location: true,
            requirements: true,
          },
        },
      },
    });

    if (payload.status === JobApplicationStatus.ACCEPTED) {
      const isAlreadyProvider = await tx.serviceProvider.findUnique({
        where: { userId: updatedApplication.userId },
      });

      if (!isAlreadyProvider) {
        await tx.serviceProvider.create({
          data: {
            userId: updatedApplication.userId,
            serviceType:
              updatedApplication.jobPost?.serviceType ?? "General Service",
          },
        });

        await tx.user.update({
          where: { id: updatedApplication.userId },
          data: { role: UserRole.SERVICE_PROVIDER },
        });
      }
    }

    return updatedApplication;
  });
};

export const JobApplicationServices = {
  applyToJob,
  getMyApplications,
  getApplicationById,
  getAllApplicationsForAdmin,
  updateApplication,
};
