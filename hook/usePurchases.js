"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPurchaseOrder,
  getPurchaseOrders,
  receivePurchase,
} from "@/lib/api/purchases";

export function usePurchaseOrders(params) {
  return useQuery({
    queryKey: ["purchases", "history", params],
    queryFn: () => getPurchaseOrders(params),
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["purchases"] }),
  });
}

export function useReceivePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: receivePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
