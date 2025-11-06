const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export async function fetchFromAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro da API: ${res.status} - ${error}`);
  }
  return res.json();
}
