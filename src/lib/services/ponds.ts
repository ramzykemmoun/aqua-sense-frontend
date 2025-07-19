import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aquaSenseApi } from "../api";
import { IPond } from "@/types/pond";

export function useGetPondsQuery() {
  return useQuery({
    queryKey: ["ponds/getAll"],
    queryFn: aquaSenseApi.ponds.getAll,
    staleTime: 0,
  });
}

export function useGetPondByIdQuery(pondId: string) {
  return useQuery({
    queryKey: ["ponds/getById", pondId],
    queryFn: () => aquaSenseApi.ponds.getById(pondId),
    enabled: !!pondId,
  });
}

export function useCreatePondMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ponds/create"],
    mutationFn: (pond: IPond) => aquaSenseApi.ponds.create(pond),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ponds/getAll"] });
    },
  });
}

export function useGetPondDataByIdQuery(pondId: string) {
  return useQuery({
    queryKey: ["ponds/getData", pondId],
    queryFn: () => aquaSenseApi.ponds.getDataByPondId(pondId),
    staleTime: Infinity,
    gcTime: 0,
  });
}
