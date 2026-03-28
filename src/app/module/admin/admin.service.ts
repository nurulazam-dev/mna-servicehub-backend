/* const appendSPToRequest = async (payload: IAppendSPPayload) => {
  return await prisma.$transaction(async (tx) => {
    const existRequest = await tx.serviceRequest.findUnique({
      where: { id: payload.serviceRequestId },
    });

    if (!existRequest) {
      throw new AppError(status.NOT_FOUND, "Service Request not found!");
    }

    const updatedSR = await tx.serviceRequest.update({
      where: { id: payload.serviceRequestId },
      data: {
        status: ServiceRequestStatus.ACCEPTED,
        providerId: payload.serviceProviderId,
      },
    });

    const schedule = await tx.serviceSchedule.create({
      data: {
        providerId: payload.serviceProviderId,
        serviceRequestId: payload.serviceRequestId,
        date: new Date(payload.scheduledDate),
        startTime: payload.startTime,
        endTime: payload.endTime,
      },
    });

    return { updatedSR, schedule };
  });
}; */

/* const acceptCandidateAsSP = async (applicationId: string) => {
  return await prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.findUnique({
      where: { id: applicationId },
      include: { user: true, jobPost: true },
    });

    if (!application) {
      throw new AppError(status.NOT_FOUND, "Job Application not found!");
    }

    if (application.status === JobApplicationStatus.ACCEPTED) {
      throw new AppError(status.BAD_REQUEST, "Candidate is already accepted!");
    }

    await tx.jobApplication.update({
      where: { id: applicationId },
      data: { status: JobApplicationStatus.ACCEPTED },
    });

    await tx.user.update({
      where: { id: application.userId },
      data: { role: UserRole.SERVICE_PROVIDER },
    });

    const spProfile = await tx.serviceProvider.create({
      data: {
        userId: application.userId,
        serviceType: application.jobPost?.serviceType || "General Service",
        experience: 0,
        bio: `Professional service provider specializing in ${application.jobPost?.serviceType || "General Service"}.`,
        isActive: true,
      },
    });

    return spProfile;
  });
}; */

export const AdminServices = {
  // appendSPToRequest,
  // acceptCandidateAsSP,
};
