export interface IDashboardStatsDataPayload {
  userCount?: number;
  providerCount?: number;
  requestCount?: number;
  serviceCount?: number;
  pendingApplications?: number;
  totalRevenue?: number | { _sum: { amount: number | null } };

  totalAssignedRequests?: number;
  completedRequests?: number;
  reviewCount?: number;
  averageRating?: number;

  totalJobApplied?: number;
  acceptedApplications?: number;
  rejectedApplications?: number;

  totalRequests?: number;
  activeRequests?: number;
  totalSpent?: number;

  requestStatusDistribution?: { status: string; count: number }[];
  monthlyRequests?: { month: string; count: number }[];
}
