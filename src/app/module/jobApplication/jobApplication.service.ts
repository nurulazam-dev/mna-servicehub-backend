import { prisma } from "../../lib/prisma";
import { IJobApplicationPayload } from "./jobApplication.interface";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { UserRole } from "../../../generated/prisma/enums";

const applyToJob = async (payload: IJobApplicationPayload) => {
  if (payload.jobPostId) {
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
  payload: Partial<IJobApplicationPayload>,
) => {
  const { ...updateData } = payload;

  return await prisma.jobApplication.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { email: true, name: true } },
      jobPost: { select: { title: true } },
    },
  });
};

export const JobApplicationServices = {
  applyToJob,
  getMyApplications,
  getApplicationById,
  getAllApplicationsForAdmin,
  updateApplication,
};
