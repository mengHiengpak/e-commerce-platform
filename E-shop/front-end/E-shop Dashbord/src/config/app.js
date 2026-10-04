import axios from "axios";
import { apiUrlBase } from "./env";

const TOKEN_KEY = "auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const api = axios.create({
  baseURL: `${apiUrlBase}`,
  withCredentials: true
});

// The cookie alone is not reliable: SameSite=Lax cookies are withheld from
// cross-site requests, so opening the app via 127.0.0.1 (or any host that
// differs from the API host) silently drops it and /auth/me 401s with
// "token is not found!". The guard accepts the JWT in a `token` header, so
// always send it there too and keep the cookie as a fallback.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.token = token;
  }
  return config;
});
