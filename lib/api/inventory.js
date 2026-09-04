import apiClient from "@/lib/apiClient";

const unwrapResults = (data) => data.results ?? data;

export async function getMedicines(params) {
  const { data } = await apiClient.get("/medicines/", { params });
  return { items: unwrapResults(data), count: data.count ?? data.length };
}

export async function getCategories() {
  const { data } = await apiClient.get("/categories/");
  return unwrapResults(data);
}

export async function getBatches(params) {
  const { data } = await apiClient.get("/batches/", { params });
  return unwrapResults(data);
}

export async function getMedicineByBarcode(barcode) {
  const { data } = await apiClient.get(
    `/medicines/barcode/${encodeURIComponent(barcode)}/`,
  );
  return data;
}

export async function searchPakistanMedicineReferences(query) {
  const { data } = await apiClient.get("/medicines/reference-search/", {
    params: { q: query },
  });
  return data;
}

export async function getSuppliers() {
  const { data } = await apiClient.get("/suppliers/");
  return unwrapResults(data);
}

export const createMedicine = async (payload) =>
  (await apiClient.post("/medicines/", payload)).data;
export const updateMedicine = async ({ id, ...payload }) =>
  (await apiClient.patch(`/medicines/${id}/`, payload)).data;
export const deleteMedicine = async (id) =>
  apiClient.delete(`/medicines/${id}/`);
export const createCategory = async (payload) =>
  (await apiClient.post("/categories/", payload)).data;
export const updateCategory = async ({ id, ...payload }) =>
  (await apiClient.patch(`/categories/${id}/`, payload)).data;
export const deleteCategory = async (id) =>
  apiClient.delete(`/categories/${id}/`);
export const createBatch = async (payload) =>
  (await apiClient.post("/batches/", payload)).data;
export const adjustBatchStock = async ({ id, ...payload }) =>
  (await apiClient.post(`/batches/${id}/adjust-stock/`, payload)).data;
