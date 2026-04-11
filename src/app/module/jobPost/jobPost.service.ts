import status from "http-status";
import { JobPost, Prisma } from "../../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IJobPostCreatePayload } from "./jobPost.interface";

const createJobPost = async (payload: IJobPostCreatePayload) => {
  const result = await prisma.jobPost.create({
    data: payload,
  });
  return result;
};

const getAllJobPosts = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    JobPost,
    Prisma.JobPostWhereInput,
    Prisma.JobPostInclude
  >(prisma.jobPost, query, {
    searchableFields: [
      "title",
      "description",
      "requirements",
      "location",
      "serviceType",
      "salaryRange",
      "deadline",
    ],
    filterableFields: ["isActive", "vacancy", "serviceType", "searchTerm"],
  });

  const result = await queryBuilder
    .search()
    .filter()
    .include({
      _count: {
        select: {
          applications: true,
        },
      },
    })
    .paginate()
    .sort()
    .fields()
    .execute();
  return result;
};

const getSingleJobPost = async (id: string) => {
  const result = await prisma.jobPost.findUnique({
    where: { id },
    include: {
      applications: true,
    },
  });
  return result;
};

const updateJobPost = async (
  id: string,
  payload: Partial<IJobPostCreatePayload>,
) => {
  const { ...updateData } = payload;

  const result = await prisma.jobPost.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const deleteJobPost = async (id: string) => {
  const isExist = await prisma.jobPost.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!isExist) {
    throw new AppError(
      status.NOT_FOUND,
      "Job post not found or already deactivated!",
    );
  }

  const result = await prisma.jobPost.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  return result;
};

export const JobPostServices = {
  createJobPost,
  getAllJobPosts,
  getSingleJobPost,
  updateJobPost,
  deleteJobPost,
};
