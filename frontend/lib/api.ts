const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://django-authentication-1-m4u1.onrender.com/'

interface ApiResponse<T = unknown> {
  data?: T
  error?: string
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await res.json()

    if (!res.ok) {
      return { error: data.error || data.detail || 'Something went wrong' }
    }

    return { data }
  } catch {
    return { error: 'Network error. Is the server running?' }
  }
}

export const api = {
  login: (username: string, password: string) =>
    request<{ access: string; refresh: string }>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string) =>
    request<{ message: string }>('/register/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: (refresh: string) =>
    request<{ message: string }>('/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }),

  getProfile: () =>
    request<{
      username: string
      email: string
      age: number | null
      school: string | null
      location: string | null
      profile_picture: string | null
    }>('/profile/', { method: 'GET' }),

  updateProfile: (data: FormData) =>
    request<{
      username: string
      email: string
      age: number | null
      school: string | null
      location: string | null
      profile_picture: string | null
    }>('/profile/', {
      method: 'PUT',
      body: data,
    }),
}
