import "server-only"

import { cookies } from "next/headers"
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin-session.constants"

export { ADMIN_TOKEN_COOKIE }

const SESSION_MAX_AGE = 60 * 60 * 24

export async function getAdminToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(ADMIN_TOKEN_COOKIE)?.value
}

export async function setAdminToken(token: string): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearAdminToken(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_TOKEN_COOKIE)
}
