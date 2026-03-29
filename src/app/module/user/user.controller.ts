import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";

const registerStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.registerStaff(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Staff register successfully",
    data: result,
  });
});

export const UserController = {
  registerStaff,
};
