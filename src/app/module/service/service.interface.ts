/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IServicePayload {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;

  // serviceRequests?: IServiceRequestPayload[];
  // reviews?: IReviewPayload[];
  serviceRequests?: any[];
  reviews?: any[];

  // createdAt: Date;
  // updatedAt: Date;
}
