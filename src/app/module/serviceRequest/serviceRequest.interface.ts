export interface ICustomerServiceRequestPayload {
  customerId: string;
  serviceIds: string[];
  providerId?: string | null;

  /*   schedule: {
    scheduledDate: string | Date;
    startTime: string;
    endTime: string;
  }; */

  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

  rejectionReason?: string | null;
}
