"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import { checkoutSale, getSales, returnSale } from "@/lib/api/pos";

export function useCheckoutSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkoutSale,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useSales(params) {
  return useQuery({
    queryKey: ["sales", "history", params],
    queryFn: () => getSales(params),
  });
}

export function useReturnSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: returnSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
