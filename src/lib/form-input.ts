/** Removes ASCII digits from a name field. */
export function stripDigits(value: string): string {
  return value.replace(/\d/g, "")
}

/** Keeps only digits, optionally capped in length. */
export function digitsOnly(value: string, maxLength?: number): string {
  const digits = value.replace(/\D/g, "")
  return maxLength !== undefined ? digits.slice(0, maxLength) : digits
}
