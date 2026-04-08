/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
export interface IRegisterStaffPayload {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    joinedDate?: string;
    experience?: string;
    imageUrl?: string;
    address?: string;
    designation?: string;
  } 
 */

export type IRegisterStaffRole = "ADMIN" | "MANAGER";

export interface IRegisterStaffPayload {
  name: string;
  email: string;
  phone: string;
  role: IRegisterStaffRole;
}

export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "SERVICE_PROVIDER"
  | "JOB_CANDIDATE"
  | "CUSTOMER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  address?: string | null;
  phone: string;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  serviceProvider?: any | null;
  serviceRequests?: any[];
  jobApplications?: any[];
  reviews?: any[];
}

export type IUpdateUserPayload = Partial<
  Pick<IUserPayload, "name" | "image" | "phone" | "address">
>;

export interface IAdminUpdateUserPayload {
  name?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  status?: UserStatus;
  emailVerified?: boolean;
  isDeleted?: boolean;
}

export interface IAdminDeleteUserPayload {
  isDeleted?: boolean;
}
