interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  headers?: Record<string, string>;
}

export async function fetchWrapper(endpoint: string, options?: FetchOptions) {
  const url = endpoint.startsWith('/') ? `/api/v1${endpoint}` : `/api/v1/${endpoint}`;
  
  try {
    const res = await fetch(url, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: options?.body
    });

    const data = await res.json().catch(() => ({}));

    return {
      success: res.ok,
      data,
      ...data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An error occurred"
    };
  }
}
