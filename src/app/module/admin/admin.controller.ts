import { Request, Response } from "express";
import { status } from "http-status";
import { AdminServices } from "./admin.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const appendSP = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.appendSPToRequest(req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "SP appended and schedule created successfully",
    data: result,
  });
});

const createStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.registerStaff(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Manager/Admin registered and email sent",
    data: result,
  });
});

const convertToSP = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.acceptCandidateAsSP(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Candidate promoted to Service Provider",
    data: result,
  });
});

export const AdminController = {
  appendSP,
  createStaff,
  convertToSP,
};
