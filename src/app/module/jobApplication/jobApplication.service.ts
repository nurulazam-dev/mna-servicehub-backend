import { prisma } from "../../lib/prisma";
import {
  IJobApplicationPayload,
  IUpdateJobApplicationPayload,
} from "./jobApplication.interface";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { UserRole } from "../../../../generated/prisma/enums";
import { JobApplication, Prisma } from "../../../../generated/prisma/client";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  jobApplicationFilterableFields,
  jobApplicationIncludeConfig,
  jobApplicationSearchableFields,
} from "./jobApplication.constant";
import { IQueryParams } from "../../interfaces/query.interface";

const applyToJob = async (payload: IJobApplicationPayload) => {
  const jobPost = await prisma.jobPost.findUnique({
    where: { id: payload.jobPostId as string },
  });

  if (!jobPost) {
    throw new AppError(status.NOT_FOUND, "Job post not found!");
  }

  if (!jobPost.isActive) {
    throw new AppError(
      status.BAD_REQUEST,
      "This job post is no longer active!",
    );
  }

  if (new Date(jobPost.deadline) < new Date()) {
    throw new AppError(
      status.BAD_REQUEST,
      "The deadline for this job has passed!",
    );
  }

  const isAlreadyApplied = await prisma.jobApplication.findUnique({
    where: {
      userId_jobPostId: {
        userId: payload.userId,
        jobPostId: payload.jobPostId as string,
      },
    },
  });

  if (isAlreadyApplied) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already applied for this job!",
    );
  }

  return await prisma.jobApplication.create({
    data: payload,
    include: { jobPost: true },
  });
};

const getMyApplications = async (query: IQueryParams, userId: string) => {
  const queryBuilder = new QueryBuilder<
    JobApplication,
    Prisma.JobApplicationWhereInput,
    Prisma.JobApplicationInclude
  >(prisma.jobApplication, query, {
    searchableFields: jobApplicationSearchableFields,
    filterableFields: jobApplicationFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      userId: userId,
    })
    .include({
      jobPost: {
        select: {
          title: true,
          serviceType: true,
          description: true,
          salaryRange: true,
          location: true,
          deadline: true,
        },
      },
    })
    .dynamicInclude(jobApplicationIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getApplicationById = async (id: string, userId: string, role: string) => {
  const result = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      jobPost: {
        select: {
          id: true,
          title: true,
          description: true,
          requirements: true,
          isActive: true,
          deadline: true,
          salaryRange: true,
          serviceType: true,
          createdAt: true,
          updatedAt: true,
        },
      },
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

const getAllApplicationsForAdmin = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    JobApplication,
    Prisma.JobApplicationWhereInput,
    Prisma.JobApplicationInclude
  >(prisma.jobApplication, query, {
    searchableFields: jobApplicationSearchableFields,
    filterableFields: jobApplicationFilterableFields,
  });
  const result = await queryBuilder
    .search()
    .filter()
    .include({
      user: true,
      jobPost: true,
    })
    .dynamicInclude(jobApplicationIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
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
            role: true,
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

    if (payload.status === "ACCEPTED") {
      const userId = updatedApplication.userId;

      const isAlreadyProvider = await tx.serviceProvider.findUnique({
        where: { userId },
      });

      if (!isAlreadyProvider) {
        await tx.serviceProvider.create({
          data: {
            userId,
            serviceType:
              updatedApplication.jobPost?.serviceType ?? "General Service",
            isActive: true,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: { role: "SERVICE_PROVIDER" },
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
