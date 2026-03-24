import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { generateTemporaryPassword, sendEmail } from "../../utils/emailHelpers";
import { IAppendSPPayload, IRegisterStaffPayload } from "./admin.interface";
import {
  JobApplicationStatus,
  UserRole,
  UserStatus,
} from "../../../generated/prisma/enums";

const appendSPToRequest = async (payload: IAppendSPPayload) => {
  return await prisma.$transaction(async (tx) => {
    const updatedSR = await tx.serviceRequest.update({
      where: { id: payload.serviceRequestId },
      data: {
        status: "ACCEPTED",
        serviceProviderId: payload.serviceProviderId,
      },
    });

    const schedule = await tx.sPSchedule.create({
      data: {
        serviceProviderId: payload.serviceProviderId,
        serviceRequestId: payload.serviceRequestId,
        date: payload.scheduledDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
      },
    });

    // sendEmail(updatedSR.customerEmail, "Service Assigned", "Your service is assigned to...");

    return { updatedSR, schedule };
  });
};

const registerStaff = async (payload: IRegisterStaffPayload) => {
  const tempPassword = generateTemporaryPassword();

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: tempPassword,
      status: UserStatus.ACTIVE,
      needPasswordChange: true,
    },
  });

  // await sendEmail(payload.email, "Your Staff Account", `Pass: ${tempPassword}`);
  return result;
};

const acceptCandidateAsSP = async (applicationId: string) => {
  return await prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) throw new AppError(status.NOT_FOUND, "Not found");

    await tx.jobApplication.update({
      where: { id: applicationId },
      data: { status: JobApplicationStatus.ACCEPTED },
    });

    await tx.user.update({
      where: { id: application.userId },
      data: { role: UserRole.SERVICE_PROVIDER },
    });

    return await tx.serviceProvider.create({
      data: {
        userId: application.userId,
        name: application.user.name,
        email: application.user.email,
      },
    });
  });
};

export const AdminServices = {
  appendSPToRequest,
  registerStaff,
  acceptCandidateAsSP,
};
