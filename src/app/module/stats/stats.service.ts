/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import {
  ServiceRequestStatus,
  UserRole,
  JobApplicationStatus,
} from "../../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IDashboardStatsDataPayload } from "./stats.interface";

const getDashboardStatsData = async (user: IRequestUser) => {
  let statsData;

  switch (user.role) {
    case UserRole.ADMIN:
      statsData = await getAdminStatsData();
      break;
    case UserRole.MANAGER:
      statsData = await getAdminStatsData();
      break;
    case UserRole.SERVICE_PROVIDER:
      statsData = await getProviderStatsData(user);
      break;
    case UserRole.JOB_CANDIDATE:
      statsData = await getCandidateStatsData(user);
      break;
    case UserRole.CUSTOMER:
      statsData = await getCustomerStatsData(user);
      break;
    default:
      throw new AppError(status.BAD_REQUEST, "Invalid user role");
  }

  return statsData;
};

/* const getAdminStatsData = async () => {
  const userCount = await prisma.user.count();
  const providerCount = await prisma.serviceProvider.count();
  const requestCount = await prisma.serviceRequest.count();
  const serviceCount = await prisma.service.count();
  const pendingApplications = await prisma.jobApplication.count({
    where: { status: JobApplicationStatus.PENDING },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" },
  });

  const requestStatusDistribution = await getRequestStatusDistribution();
  const monthlyRequests = await getMonthlyRequestData();

  return {
    userCount,
    providerCount,
    requestCount,
    serviceCount,
    pendingApplications,
    totalRevenue,
    requestStatusDistribution,
    monthlyRequests,
  };
}; */

const getAdminStatsData = async (): Promise<IDashboardStatsDataPayload> => {
  const [
    userCount,
    providerCount,
    requestCount,
    serviceCount,
    pendingApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.serviceProvider.count(),
    prisma.serviceRequest.count(),
    prisma.service.count(),
    prisma.jobApplication.count({ where: { status: "PENDING" } }),
  ]);

  const totalRevenueResult = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" },
  });

  return {
    userCount,
    providerCount,
    requestCount,
    serviceCount,
    pendingApplications,
    totalRevenue: Number(totalRevenueResult._sum.amount || 0),
    requestStatusDistribution: await getRequestStatusDistribution(),
    monthlyRequests: await getMonthlyRequestData(),
  };
};

const getProviderStatsData = async (
  user: IRequestUser,
): Promise<IDashboardStatsDataPayload> => {
  const provider = await prisma.serviceProvider.findUniqueOrThrow({
    where: { userId: user.userId },
  });

  const totalAssignedRequests = await prisma.serviceRequest.count({
    where: { providerId: provider.id },
  });

  const completedRequests = await prisma.serviceRequest.count({
    where: {
      providerId: provider.id,
      status: ServiceRequestStatus.COMPLETED,
    },
  });

  const reviewCount = await prisma.review.count({
    where: { providerId: provider.id },
  });

  const avgRating = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { providerId: provider.id },
  });

  return {
    totalAssignedRequests,
    completedRequests,
    reviewCount,
    averageRating: avgRating._avg.rating || 0,
  };
};

const getCandidateStatsData = async (
  user: IRequestUser,
): Promise<IDashboardStatsDataPayload> => {
  const candidate = await prisma.user.findUniqueOrThrow({
    where: { id: user.userId },
  });

  const totalJobApplied = await prisma.jobApplication.count({
    where: { userId: candidate.id },
  });

  const totalPendingJobApplications = await prisma.jobApplication.count({
    where: {
      userId: candidate.id,
      status: JobApplicationStatus.PENDING,
    },
  });

  const totalAcceptedJobApplications = await prisma.jobApplication.count({
    where: {
      userId: candidate.id,
      status: JobApplicationStatus.ACCEPTED,
    },
  });

  const totalRejectedJobApplications = await prisma.jobApplication.count({
    where: {
      userId: candidate.id,
      status: JobApplicationStatus.REJECTED,
    },
  });

  return {
    totalJobApplied: totalJobApplied || 0,
    pendingApplications: totalPendingJobApplications || 0,
    acceptedApplications: totalAcceptedJobApplications || 0,
    rejectedApplications: totalRejectedJobApplications || 0,
  };
};

/* const getCustomerStatsData = async (user: IRequestUser) => {
  const totalRequests = await prisma.serviceRequest.count({
    where: { customerId: user.userId },
  });

  const activeRequests = await prisma.serviceRequest.count({
    where: {
      customerId: user.userId,
      status: {
        in: [ServiceRequestStatus.PENDING, ServiceRequestStatus.ACCEPTED],
      },
    },
  });

  const totalSpent = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      serviceRequest: {
        customerId: user.userId,
      },
      status: PaymentStatus.PAID,
    },
  });

  return {
    totalRequests,
    activeRequests,
    totalSpent: totalSpent._sum.amount || 0,
  };
}; */

const getCustomerStatsData = async (
  user: IRequestUser,
): Promise<IDashboardStatsDataPayload> => {
  const totalRequests = await prisma.serviceRequest.count({
    where: {
      customerId: user.userId,
    },
  });

  const activeRequests = await prisma.serviceRequest.count({
    where: {
      customerId: user.userId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
  });

  const completedRequests = await prisma.serviceRequest.count({
    where: {
      customerId: user.userId,
      status: { in: ["COMPLETED"] },
    },
  });

  const totalSpent = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      serviceRequest: { customerId: user.userId },
      status: "PAID",
    },
  });

  return {
    totalRequests,
    activeRequests,
    completedRequests,
    totalSpent: Number(totalSpent._sum.amount || 0),
  };
};

const getRequestStatusDistribution = async () => {
  const stats = await prisma.serviceRequest.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return stats.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));
};

const getMonthlyRequestData = async () => {
  const result: any[] = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "service_requests"
    GROUP BY month
    ORDER BY month ASC;
  `;

  return result;
};

export const StatsService = {
  getDashboardStatsData,
};
