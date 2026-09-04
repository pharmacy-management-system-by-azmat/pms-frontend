"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/lib/api/customers";

const key = ["customers"];

function useCustomerMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

export function useCustomers(params) {
  return useQuery({
    queryKey: [...key, params],
    queryFn: () => getCustomers(params),
  });
}
export function useCreateCustomer() {
  return useCustomerMutation(createCustomer);
}
export function useUpdateCustomer() {
  return useCustomerMutation(updateCustomer);
}
export function useDeleteCustomer() {
  return useCustomerMutation(deleteCustomer);
}
