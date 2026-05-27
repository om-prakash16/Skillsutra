const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function login(data: any) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
}

export async function signup(data: any) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Signup failed");
  }

  return response.json();
}

export async function refreshSession(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Session expired");
  }

  return response.json();
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
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token");

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  
  const json = await response.json();
  if (json && typeof json === "object" && "status" in json && "data" in json) {
    return json.data;
  }
  return json;
}
