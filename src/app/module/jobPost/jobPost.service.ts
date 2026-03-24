import { prisma } from "../../lib/prisma";
import { IJobPostCreatePayload } from "./jobPost.interface";

const createJobPost = async (payload: IJobPostCreatePayload) => {
  const result = await prisma.jobPost.create({
    data: payload,
  });
  return result;
};

const getAllJobPosts = async () => {
  const result = await prisma.jobPost.findMany({
    /*  where: {
      isActive: true,
      deadline: {
        gte: new Date(), 
      },
    }, */
    include: {
      _count: {
        select: { applications: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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

export const JobPostServices = {
  createJobPost,
  getAllJobPosts,
  getSingleJobPost,
  updateJobPost,
};
