/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ServiceRequestServices } from "./serviceRequest.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { IServiceRequestFilterRequest } from "./serviceRequest.interface";

const createServiceRequest = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req.user as any).id;

  const { serviceId, serviceDescription, serviceAddress, activePhone } =
    req.body;

  const result = await ServiceRequestServices.createServiceRequest({
    customerId,
    serviceId,
    serviceDescription,
    serviceAddress,
    activePhone,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Service request created successfully",
    data: result,
  });
});

const getMyServiceRequestByCustomer = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = (req.user as any).id;

    const result =
      await ServiceRequestServices.getMyServiceRequestByCustomer(customerId);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Customer service requests retrieved successfully",
      data: result,
    });
  },
);

const getMyServiceRequestByServiceProvider = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = (req.user as any).id;

    const result =
      await ServiceRequestServices.getMyServiceRequestByServiceProvider(
        providerId,
      );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Provider assigned service requests retrieved successfully",
      data: result,
    });
  },
);

const getServiceRequestById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // const user = req.user as { userId: string; role: string };
    const user = req.user as IRequestUser;

    const result = await ServiceRequestServices.getServiceRequestById(
      id as string,
      user,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Service request details retrieved successfully",
      data: result,
    });
  },
);

const getAllServiceRequest = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query as unknown as IServiceRequestFilterRequest;

  const result = await ServiceRequestServices.getAllServiceRequest(filters);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All service requests retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ServiceRequestController = {
  createServiceRequest,
  getMyServiceRequestByCustomer,
  getMyServiceRequestByServiceProvider,
  getServiceRequestById,
  getAllServiceRequest,
};
