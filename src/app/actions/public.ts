"use server"

import type { ActionResult } from "@/app/actions/types"
import { ApiError } from "@/lib/api-error"
import { apiRequest } from "@/lib/api-server"
import {
  validateCheckin,
  validateProject,
  validateRegistration,
  type ProjectFormInput,
  type RegistrationFormInput,
} from "@/lib/validation"

function toActionError(err: unknown): ActionResult {
  if (err instanceof ApiError && err.code) {
    return { success: false, error: err.code }
  }
  return { success: false, error: "unknown" }
}

export async function submitRegistration(
  input: RegistrationFormInput,
): Promise<ActionResult> {
  const validated = validateRegistration(input)
  if (!validated.ok) return { success: false, error: validated.error }

  try {
    await apiRequest("/registrations", {
      method: "POST",
      body: JSON.stringify(validated.data),
    })
    return { success: true }
  } catch (err) {
    return toActionError(err)
  }
}

export async function submitProject(input: ProjectFormInput): Promise<ActionResult> {
  const validated = validateProject(input)
  if (!validated.ok) return { success: false, error: validated.error }

  try {
    await apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(validated.data),
    })
    return { success: true }
  } catch (err) {
    return toActionError(err)
  }
}

export async function submitCheckin(input: {
  student_registration: string
}): Promise<ActionResult> {
  const validated = validateCheckin(input)
  if (!validated.ok) return { success: false, error: validated.error }

  try {
    await apiRequest("/checkin", {
      method: "POST",
      body: JSON.stringify(validated.data),
    })
    return { success: true }
  } catch (err) {
    return toActionError(err)
  }
}
