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
