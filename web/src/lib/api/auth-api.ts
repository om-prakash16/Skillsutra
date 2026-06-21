import { fetchWithAuth, API_BASE_URL } from "./api-client";

export async function login(data: any) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
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
  await fetch(`${API_BASE_URL}/auth/logout`, {
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

export async function forgotPassword(email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Request failed");
  return json;
}

export async function validateResetToken(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/validate-reset-token?token=${token}`);
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Invalid token");
  return json;
}

export async function resetPassword(token: string, new_password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password }),
  });
  
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Reset failed");
  return json;
}

export async function requestMagicLink(email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Request failed");
  return json;
}

export async function verifyMagicLink(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-magic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Verification failed");
  return json;
}

export async function sendSignupOtp(email: string, name?: string) {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Request failed");
  return json;
}

export async function verifySignupOtp(email: string, code: string) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Verification failed");
  return json;
}

export async function completeMagicLinkSetup(data: any) {
  const response = await fetch(`${API_BASE_URL}/auth/complete-setup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  let json;
  try { json = await response.json(); } catch(e) {}
  if (!response.ok) throw new Error(json?.detail || "Setup failed");
  return json;
}
