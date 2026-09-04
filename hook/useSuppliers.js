"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "@/lib/api/suppliers";

const supplierKey = ["suppliers"];

function useSupplierMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supplierKey }),
  });
}

export function useSuppliers() {
  return useQuery({ queryKey: supplierKey, queryFn: getSuppliers });
}
export function useCreateSupplier() {
  return useSupplierMutation(createSupplier);
}
export function useUpdateSupplier() {
  return useSupplierMutation(updateSupplier);
}
export function useDeleteSupplier() {
  return useSupplierMutation(deleteSupplier);
}
