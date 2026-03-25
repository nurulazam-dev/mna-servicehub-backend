/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ServiceRequestServices } from "./serviceRequest.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

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

export const ServiceRequestController = {
  createServiceRequest,
  getMyServiceRequestByCustomer,
};
