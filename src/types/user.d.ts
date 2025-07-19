import { IPond } from "./pond";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ICreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "Admin" | "Supervisor";
}

export interface IUser {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  ponds: IPond[];
  role: "Admin" | "Supervisor";
  hashedPassword?: string; // Optional for security reasons
}

export interface IUserLoginResponse {
  user: IUser;
  token: string;
}
