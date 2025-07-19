import { useMutation } from "@tanstack/react-query";
import { aquaSenseApi } from "../api";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["auth/login"],
    mutationFn: aquaSenseApi.auth.login,
  });
};
