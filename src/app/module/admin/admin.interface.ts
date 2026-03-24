export interface IAppendSPPayload {
  serviceRequestId: string;
  serviceProviderId: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
}

export interface IRegisterStaffPayload {
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "MANAGER";
}
