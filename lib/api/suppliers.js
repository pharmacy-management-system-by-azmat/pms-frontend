import apiClient from "@/lib/apiClient";

const unwrapResults = (data) => data.results ?? data;

export async function getSuppliers() {
  const { data } = await apiClient.get("/suppliers/");
  return unwrapResults(data);
}

export const createSupplier = async (payload) =>
  (await apiClient.post("/suppliers/", payload)).data;
export const updateSupplier = async ({ id, ...payload }) =>
  (await apiClient.patch(`/suppliers/${id}/`, payload)).data;
export const deleteSupplier = async (id) =>
  apiClient.delete(`/suppliers/${id}/`);
