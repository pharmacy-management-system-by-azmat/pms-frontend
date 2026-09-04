import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const ACCESS_TOKEN_KEY = "mediflow_access_token";
const REFRESH_TOKEN_KEY = "mediflow_refresh_token";
const ACCESS_TOKEN_COOKIE = "mediflow_access_token";

function writeAccessTokenCookie(accessToken, remember) {
  const maxAge = remember ? "; max-age=604800" : "";
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; path=/; samesite=lax${maxAge}`;
}

export const getAccessToken = () =>
  typeof window === "undefined"
    ? null
    : (window.localStorage.getItem(ACCESS_TOKEN_KEY) ??
      window.sessionStorage.getItem(ACCESS_TOKEN_KEY));

export const getRefreshToken = () =>
  typeof window === "undefined"
    ? null
    : (window.localStorage.getItem(REFRESH_TOKEN_KEY) ??
      window.sessionStorage.getItem(REFRESH_TOKEN_KEY));

export function setAuthTokens({ access, refresh }, remember = true) {
  if (typeof window === "undefined") return;

  const storage = remember ? window.localStorage : window.sessionStorage;
  const otherStorage = remember ? window.sessionStorage : window.localStorage;

  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);
  storage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) storage.setItem(REFRESH_TOKEN_KEY, refresh);
  writeAccessTokenCookie(access, remember);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

function redirectToLogin() {
  if (
    typeof window === "undefined" ||
    window.location.pathname === "/auth/login"
  )
    return;

  const next = `${window.location.pathname}${window.location.search}`;
  window.location.replace(`/auth/login?next=${encodeURIComponent(next)}`);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise = null;

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes(
      "auth/token/refresh/",
    );

    if (
      isUnauthorized &&
      !originalRequest?._retry &&
      !isRefreshRequest &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        refreshPromise ??= axios
          .post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: getRefreshToken(),
          })
          .then((response) => response.data)
          .finally(() => {
            refreshPromise = null;
          });

        const tokens = await refreshPromise;
        setAuthTokens(tokens);
        originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
        return apiClient(originalRequest);
      } catch {
        clearAuthTokens();
        redirectToLogin();
      }
    }

    if (isUnauthorized && !isRefreshRequest) {
      clearAuthTokens();
      redirectToLogin();
    }

    const message =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
