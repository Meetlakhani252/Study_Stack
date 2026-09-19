const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

async function apiFetch<T>(endpoint: string, options: RequestInit | undefined = {}): Promise<T> {
  const finalOptions = options || {};
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...finalOptions,
    headers: {
      'Content-Type': 'application/json',
      ...finalOptions.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  post: <T,>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  get: <T,>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: 'GET' }),
}
