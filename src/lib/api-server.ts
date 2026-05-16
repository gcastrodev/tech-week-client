import "server-only"

import { ApiError } from "@/lib/api-error"

export function getApiBaseUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3000"
  )
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
    cache: "no-store",
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
