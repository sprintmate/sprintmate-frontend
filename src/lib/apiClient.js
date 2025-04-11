// src/lib/apiClient.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sprintmate-production.up.railway.app";

// Helper to get token from localStorage (or any storage mechanism you use)
function getToken() {
  return localStorage.getItem("authToken");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  console.log("API Request:", {
    url: `${BASE_URL}${path}`,
    token: token ? "Present" : "Missing",
    options
  });

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }), // only attach if token exists
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", {
        status: res.status,
        statusText: res.statusText,
        path,
        error: errorText
      });
      
      let errorMessage = "API Error";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText || res.statusText;
      }
      
      throw new Error(`${errorMessage} (Status: ${res.status})`);
    }

    return res.json();
  } catch (error) {
    console.error("API Request Failed:", {
      path,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
