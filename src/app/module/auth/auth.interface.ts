export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
