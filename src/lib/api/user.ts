import { IUser, ICreateUserInput } from "@/types/user";
import { api } from ".";

export class UserApi {
  constructor() {}

  async getAll() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Access token is required");
    }

    const response = await api.get<IUser[]>("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async create(data: ICreateUserInput) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Access token is required");
    }

    const response = await api.post<IUser, ICreateUserInput>("/user", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async update(id: string, data: Partial<ICreateUserInput>) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Access token is required");
    }

    const response = await api.put<IUser, Partial<ICreateUserInput>>(
      `/user/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async delete(id: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Access token is required");
    }

    const response = await api.delete(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}
