export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
