// O backend Rust/Axum precisa de middleware CORS configurado.
// Adicionar tower_http::cors::CorsLayer no main.rs do backend.
// Sem isso, todas as requests vão falhar no browser com CORS error.

import type {
  RegistrationPayload,
  Registration,
  ProjectPayload,
  Project,
  CheckinPayload,
  AdminLoginPayload,
  AdminLoginResponse,
} from "./types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

/** Thrown on non-OK responses; `message` matches API `error` when present (backward compatible). */
export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, code?: string) {
    super(code ?? `HTTP_${status}`)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

export function isAdminSessionAuthError(err: unknown): boolean {
  if (!(err instanceof ApiError) || err.status !== 401) return false
  return err.code === "invalid_token" || err.code === "missing_token"
}

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("admin_token")
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    let code: string | undefined
    try {
      const body = (await res.json()) as { error?: string }
      if (typeof body?.error === "string") code = body.error
    } catch {
      /* non-JSON body */
    }
    throw new ApiError(res.status, code)
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export async function postRegistration(data: RegistrationPayload) {
  return request<void>("/registrations", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function postProject(data: ProjectPayload) {
  return request<void>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function postCheckin(data: CheckinPayload) {
  return request<void>("/checkin", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function adminLogin(data: AdminLoginPayload) {
  return request<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getRegistrations() {
  return request<Registration[]>("/registrations", {
    headers: authHeaders(),
  })
}

export async function getProjects() {
  return request<Project[]>("/projects", {
    headers: authHeaders(),
  })
}
