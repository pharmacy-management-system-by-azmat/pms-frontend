import apiClient from "@/lib/apiClient";

export async function checkoutSale(payload) {
  const { data } = await apiClient.post("/sales/checkout/", payload);
  return data;
}

export async function getSales(params) {
  const { data } = await apiClient.get("/sales/", { params });
  return {
    items: data.results ?? data,
    count: data.count ?? data.length,
  };
}

export async function returnSale({ saleId, ...payload }) {
  const { data } = await apiClient.post(
    `/sales/${saleId}/return-sale/`,
    payload,
  );
  return data;
}
