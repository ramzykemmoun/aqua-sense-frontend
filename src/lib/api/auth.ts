import { ILoginInput, IUserLoginResponse } from "@/types/user";
import { api } from ".";

export class AuthApi {
  constructor() {}

  async login(data: ILoginInput) {
    const response = await api.post<IUserLoginResponse, ILoginInput>(
      "/auth/login",
      data
    );

    return response.data;
  }
}
