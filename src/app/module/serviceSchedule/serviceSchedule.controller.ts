import { Request, Response } from "express";
import { ServiceScheduleServices } from "./serviceSchedule.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const createServiceSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;

    const result = await ServiceScheduleServices.createServiceSchedule(
      user.userId,
      req.body,
    );

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "3 Service slots created successfully",
      data: result,
    });
  },
);

const getMySchedules = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;

  const result = await ServiceScheduleServices.getMySchedules(user.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Provider schedules retrieved successfully",
    data: result,
  });
});

export const ServiceScheduleController = {
  createServiceSchedule,
  getMySchedules,
};
