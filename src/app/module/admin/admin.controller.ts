// import { Request, Response } from "express";
// import status from "http-status";
// import { AdminServices } from "./admin.service";
// import { catchAsync } from "../../shared/catchAsync";
// import { sendResponse } from "../../shared/sendResponse";

/* const appendSP = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.appendSPToRequest(req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Provider assigned and schedule created successfully",
    data: result,
  });
}); */

/* const convertToSP = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.acceptCandidateAsSP(id);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Candidate promoted to Service Provider profile",
    data: result,
  });
}); */

export const AdminController = {
  // appendSP,
  // convertToSP,
};
