import apiClient from "@/lib/apiClient";

const unwrapResults = (data) => data.results ?? data;

export async function getCustomers(params) {
  const { data } = await apiClient.get("/customers/", { params });
  return unwrapResults(data);
}

export const createCustomer = async (payload) =>
  (await apiClient.post("/customers/", payload)).data;
export const updateCustomer = async ({ id, ...payload }) =>
  (await apiClient.patch(`/customers/${id}/`, payload)).data;
export const deleteCustomer = async (id) =>
  apiClient.delete(`/customers/${id}/`);
