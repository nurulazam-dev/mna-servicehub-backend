/* export interface ICustomerServiceRequestPayload {
  customerId: string;
  serviceIds: string[];
  providerId?: string | null;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  rejectionReason?: string | null;
} */

export interface ICreateServiceRequestPayload {
  customerId: string;
  serviceId: string;
  serviceDescription: string;
  serviceAddress: string;
  activePhone: string;
}
