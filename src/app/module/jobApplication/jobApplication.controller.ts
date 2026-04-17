/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { status } from "http-status";
import { JobApplicationServices } from "./jobApplication.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { IQueryParams } from "../../interfaces/query.interface";

const applyToJob = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).id || (req.user as any).userId;

  const result = await JobApplicationServices.applyToJob({
    ...req.body,
    userId,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Application submitted successfully",
    data: result,
  });
});

const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;

  const result = await JobApplicationServices.getMyApplications(userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Applications fetched successfully",
    data: result,
  });
});

const getApplicationById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;
  const role = (req.user as any).role;
  const { id } = req.params;

  const result = await JobApplicationServices.getApplicationById(
    id as string,
    userId,
    role,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Application details fetched",
    data: result,
  });
});

const getAllApplicationsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;

    const result = await JobApplicationServices.getAllApplicationsForAdmin(
      query as IQueryParams,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "All applications fetched for admin",
      data: result,
    });
  },
);

const updateApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await JobApplicationServices.updateApplication(
    id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Application updated successfully",
    data: result,
  });
});

export const JobApplicationController = {
  applyToJob,
  getMyApplications,
  getApplicationById,
  getAllApplicationsForAdmin,
  updateApplication,
};
