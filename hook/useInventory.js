"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adjustBatchStock,
  createBatch,
  createCategory,
  createMedicine,
  deleteMedicine,
  deleteCategory,
  getBatches,
  getCategories,
  getMedicineByBarcode,
  searchPakistanMedicineReferences,
  getMedicines,
  getSuppliers,
  updateMedicine,
  updateCategory,
} from "@/lib/api/inventory";

const inventoryKeys = {
  medicines: (filters) => ["inventory", "medicines", filters],
  categories: ["inventory", "categories"],
  batches: ["inventory", "batches"],
  suppliers: ["inventory", "suppliers"],
};

function useInventoryMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useMedicines(filters) {
  return useQuery({
    queryKey: inventoryKeys.medicines(filters),
    queryFn: () => getMedicines(filters),
  });
}
export function useCategories() {
  return useQuery({
    queryKey: inventoryKeys.categories,
    queryFn: getCategories,
  });
}
export function useBatches(params) {
  return useQuery({
    queryKey: inventoryKeys.batches,
    queryFn: () => getBatches(params),
  });
}
export function useSuppliers() {
  return useQuery({ queryKey: inventoryKeys.suppliers, queryFn: getSuppliers });
}
export function useCreateMedicine() {
  return useInventoryMutation(createMedicine);
}
export function useUpdateMedicine() {
  return useInventoryMutation(updateMedicine);
}
export function useDeleteMedicine() {
  return useInventoryMutation(deleteMedicine);
}
export function useCreateCategory() {
  return useInventoryMutation(createCategory);
}
export function useUpdateCategory() {
  return useInventoryMutation(updateCategory);
}
export function useDeleteCategory() {
  return useInventoryMutation(deleteCategory);
}
export function useCreateBatch() {
  return useInventoryMutation(createBatch);
}
export function useAdjustBatchStock() {
  return useInventoryMutation(adjustBatchStock);
}

export function useBarcodeLookup() {
  return useMutation({ mutationFn: getMedicineByBarcode });
}

export function usePakistanMedicineReferences(query) {
  return useQuery({
    queryKey: ["inventory", "pakistan-medicine-references", query],
    queryFn: () => searchPakistanMedicineReferences(query),
    enabled: query.trim().length >= 2,
  });
}
