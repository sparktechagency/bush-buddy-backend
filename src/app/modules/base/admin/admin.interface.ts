export interface IAdmin {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: "admin";
  isDeleted?: boolean;
}
