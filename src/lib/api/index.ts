import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { HTTPResponse } from "@/types/response";
import { AuthApi } from "./auth";
import { PondsApi } from "./ponds";
import { UserApi } from "./user";

const baseURL =
  import.meta.env.NEXT_VITE_API_URL || "http://192.168.137.1:9999/api/v1/";

if (!baseURL) {
  console.warn("🔴 Environment variable REACT_APP_API_URL is not set");
}

export const instance = axios.create({
  baseURL,
});

type HTTPRequestConfig = AxiosRequestConfig;

const getApiInstance = (instance: AxiosInstance) => {
  return {
    get: <T>(url: string, config: HTTPRequestConfig = {}) => {
      return instance.get<HTTPResponse<T>>(url, config);
    },
    delete: <T>(url: string, config: HTTPRequestConfig = {}) => {
      return instance.delete<HTTPResponse<T>>(url, config);
    },
    put: <T, P>(url: string, body: P, config: HTTPRequestConfig = {}) => {
      return instance.put<HTTPResponse<T>>(url, body, config);
    },
    patch: <T, P>(url: string, body: P, config: HTTPRequestConfig = {}) => {
      return instance.patch<HTTPResponse<T>>(url, body, config);
    },
    post: <T, P>(url: string, body: P, config: HTTPRequestConfig = {}) => {
      return instance.post<HTTPResponse<T>>(url, body, config);
    },
  };
};

export const api = getApiInstance(instance);

export class AquaSenseApi {
  user: UserApi;
  auth: AuthApi;
  ponds: PondsApi;

  constructor() {
    this.user = new UserApi();
    this.auth = new AuthApi();
    this.ponds = new PondsApi();
  }
}

export const aquaSenseApi = new AquaSenseApi();
