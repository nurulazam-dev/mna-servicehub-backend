export interface ICreateServiceRequestPayload {
  customerId: string;
  serviceId: string;
  serviceDescription: string;
  serviceAddress: string;
  activePhone: string;
}

export interface IServiceRequestFilterRequest {
  status?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface IUpdateServiceCostPayload {
  serviceCharge: number;
  productCost: number;
  additionalCost: number;
}

export interface IUpdateServiceByManagement {
  status: "ACCEPTED" | "REJECTED";
  providerId?: string;
  scheduleId?: string;
  rejectionReason?: string;
}
