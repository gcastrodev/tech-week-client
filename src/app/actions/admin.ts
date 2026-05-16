"use server"

import type { ActionResult } from "@/app/actions/types"
import { ApiError } from "@/lib/api-error"
import { apiRequest } from "@/lib/api-server"
import { clearAdminToken, getAdminToken, setAdminToken } from "@/lib/admin-session"
import type { AdminLoginResponse, Project, Registration } from "@/lib/types"

export async function loginAdmin(email: string, password: string): Promise<ActionResult> {
  const trimmedEmail = email.trim()
  if (!trimmedEmail || !password) {
    return { success: false, error: "missing_fields" }
  }

  try {
    const res = await apiRequest<AdminLoginResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: trimmedEmail, password }),
    })
    await setAdminToken(res.token)
    return { success: true }
  } catch (err) {
    if (err instanceof ApiError && err.code === "invalid_credentials") {
      return { success: false, error: "invalid_credentials" }
    }
    return { success: false, error: "unknown" }
  }
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminToken()
}

export async function fetchAdminRegistrations(): Promise<Registration[]> {
  const token = await getAdminToken()
  if (!token) throw new ApiError(401, "missing_token")

  return apiRequest<Registration[]>("/registrations", { headers: {} }, token)
}

export async function fetchAdminProjects(): Promise<Project[]> {
  const token = await getAdminToken()
  if (!token) throw new ApiError(401, "missing_token")

  return apiRequest<Project[]>("/projects", { headers: {} }, token)
}
