import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { JobPostServices } from "./jobPost.service";
import { IQueryParams } from "../../interfaces/query.interface";

const createJobPost = catchAsync(async (req: Request, res: Response) => {
  const result = await JobPostServices.createJobPost(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Job post created successfully!",
    data: result,
  });
});

const getAllJobPosts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await JobPostServices.getAllJobPosts(query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Job posts fetched successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleJobPost = catchAsync(async (req: Request, res: Response) => {
  const result = await JobPostServices.getSingleJobPost(
    req.params.id as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Job post details fetched!",
    data: result,
  });
});

const updateJobPost = catchAsync(async (req: Request, res: Response) => {
  const result = await JobPostServices.updateJobPost(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Job post updated successfully!",
    data: result,
  });
});

const deleteJobPost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await JobPostServices.deleteJobPost(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Job post deleted successfully",
    data: result,
  });
});

export const JobPostController = {
  createJobPost,
  getAllJobPosts,
  getSingleJobPost,
  updateJobPost,
  deleteJobPost,
};
