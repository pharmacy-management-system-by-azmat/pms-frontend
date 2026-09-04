import apiClient from "@/lib/apiClient";

export async function getSettings() {
  const { data } = await apiClient.get("/settings/");
  return data;
}

export async function updateSettings(payload) {
  const { data } = await apiClient.patch("/settings/update/", payload);
  return data;
}
