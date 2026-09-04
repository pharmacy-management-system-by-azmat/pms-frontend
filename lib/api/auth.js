import apiClient, { clearAuthTokens, setAuthTokens } from "@/lib/apiClient";

export async function login({ email, password, remember }) {
  const { data } = await apiClient.post("/auth/token/", {
    username: email,
    password,
  });

  setAuthTokens(data, remember);

  return data;
}

export function logout() {
  clearAuthTokens();
}
