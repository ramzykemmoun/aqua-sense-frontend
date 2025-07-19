import { api } from ".";
import { IPond, IPondData } from "@/types/pond";

export class PondsApi {
  constructor() {}

  async getAll() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Access token is required");
    }

    const response = await api.get<IPond[]>("/pond", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async getById(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Access token is required");
    }
    const response = await api.get<IPond>(`/pond/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  async create(pond: IPond) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Access token is required");
    }
    const response = await api.post<IPond, IPond>("/pond", pond, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async getDataByPondId(pondId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Access token is required");
    }
    const response = await api.get<IPondData[]>(`/pond/${pondId}/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}
