import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aquaSenseApi } from "../api";
import { ICreateUserInput } from "@/types/user";

export function useGetUsersQuery() {
  return useQuery({
    queryKey: ["user/getAll"],
    queryFn: aquaSenseApi.user.getAll,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user/create"],
    mutationFn: (userData: ICreateUserInput) =>
      aquaSenseApi.user.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user/getAll"] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user/update"],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ICreateUserInput>;
    }) => aquaSenseApi.user.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user/getAll"] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user/delete"],
    mutationFn: (id: string) => aquaSenseApi.user.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user/getAll"] });
    },
  });
}
