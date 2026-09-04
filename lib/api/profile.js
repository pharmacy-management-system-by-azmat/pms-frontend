import apiClient from "@/lib/apiClient";

export async function getMyProfile() {
  const { data } = await apiClient.get("/users/me/");
  return data;
}

export async function updateMyProfile(profile) {
  const { data } = await apiClient.patch("/users/me/", profile);
  return data;
}
