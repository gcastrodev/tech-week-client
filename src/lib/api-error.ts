/** Thrown on non-OK API responses; `message` matches API `error` when present. */
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
