export interface IRegisterStaffPayload {
  password: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    joinedDate?: string;
    experience?: string;
    imgUrl?: string;
    address?: string;
    designation: string;
  };
}
