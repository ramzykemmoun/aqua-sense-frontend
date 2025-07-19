import { HTTPResponse } from "@/types/response";

export function mockResponse<T>(
  data: T,
  message: string,
  delay: number = 1000
): Promise<HTTPResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        message,
        success: true,
      } as HTTPResponse<T>);
    }, delay);
  });
}
