const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

import { fetchWithAuth } from "./api-client";

export async function login(data: any) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let json;
  try { json = await response.json(); } catch(e) {}

  if (!response.ok) {
    throw new Error(json?.error?.message || json?.detail || json?.message || "Login failed");
  }

  return json;
}

export async function signup(data: any) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let json;
  try { json = await response.json(); } catch(e) {}

  if (!response.ok) {
    throw new Error(json?.error?.message || json?.detail || json?.message || "Signup failed");
  }

  return json;
}

export async function refreshSession(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  let json;
  try { json = await response.json(); } catch(e) {}

  if (!response.ok) {
    throw new Error(json?.error?.message || json?.detail || "Session expired");
  }

  return json;
}

export async function logout(refreshToken: string) {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function me() {
  // Uses fetchWithAuth to get interceptor behavior (auto-refresh, standard errors)
  return fetchWithAuth("/auth/me", { method: "GET" });
}
