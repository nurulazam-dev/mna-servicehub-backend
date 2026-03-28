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

export interface IRegisterStaffPayload {
  name: string;
  email: string;
  phone: string;
  // role: UserRole.ADMIN | UserRole.MANAGER;
  role: "ADMIN" | "MANAGER";
}
