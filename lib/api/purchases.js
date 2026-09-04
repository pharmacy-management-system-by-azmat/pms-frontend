import apiClient from "@/lib/apiClient";

export async function getPurchaseOrders(params) {
  const { data } = await apiClient.get("/purchase-orders/", { params });
  return { items: data.results ?? data, count: data.count ?? data.length };
}

export async function createPurchaseOrder(payload) {
  const { data } = await apiClient.post(
    "/purchase-orders/create-order/",
    payload,
  );
  return data;
}

export async function receivePurchase(payload) {
  const { data } = await apiClient.post(
    "/purchase-orders/receive-stock/",
    payload,
  );
  return data;
}
