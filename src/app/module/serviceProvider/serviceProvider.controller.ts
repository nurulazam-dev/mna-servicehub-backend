import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { ServiceProviderService } from "./serviceProvider.service";
import { sendResponse } from "../../shared/sendResponse";
import { IQueryParams } from "../../interfaces/query.interface";

const getAllServiceProviders = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ServiceProviderService.getAllServiceProviders(
      req.query as unknown as IQueryParams,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Service Providers fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getServiceProviderById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ServiceProviderService.getServiceProviderById(
      id as string,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Service Provider fetched successfully",
      data: result,
    });
  },
);

/* const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateUserById(id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});
 */

export const ServiceProviderController = {
  getAllServiceProviders,
  getServiceProviderById,
  // updateServiceProviderById,
};
