import type {
  CheckinPayload,
  ProjectPayload,
  RegistrationPayload,
} from "@/lib/types"

export const ALLOWED_COURSES = [
  "Engenharia de Software",
  "Sistemas de Informação",
  "Ciência da Computação",
  "Análise e Desenvolvimento de Sistemas",
  "Engenharia de Computação",
  "Outro",
] as const

export type RegistrationFormInput = {
  name: string
  student_registration: string
  course_name: string
  course_period: string
  coffee_break: boolean
}

export type ProjectFormInput = {
  submitter_name: string
  submitter_registration: string
  project_name: string
  description: string
}

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

const RA_PATTERN = /^\d{9}$/
const NAME_MAX = 255
const TEXT_MAX = 255
const DESCRIPTION_MAX = 500

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ")
}

function isValidPersonName(value: string): boolean {
  const name = normalizeName(value)
  if (!name || name.length > NAME_MAX) return false
  if (/\d/.test(name)) return false
  return true
}

function parseRa(value: string): string | null {
  const ra = value.trim()
  return RA_PATTERN.test(ra) ? ra : null
}

function parsePeriod(value: string): number | null {
  if (!/^\d{1,2}$/.test(value.trim())) return null
  const period = Number(value)
  if (period < 1 || period > 12) return null
  return period
}

export function validateRegistration(
  input: RegistrationFormInput,
): ValidationResult<RegistrationPayload> {
  if (!isValidPersonName(input.name)) return { ok: false, error: "invalid_name" }

  const ra = parseRa(input.student_registration)
  if (!ra) return { ok: false, error: "invalid_student_registration" }

  const course = input.course_name.trim()
  if (!course || course.length > TEXT_MAX) {
    return { ok: false, error: "invalid_course_name" }
  }
  if (!(ALLOWED_COURSES as readonly string[]).includes(course)) {
    return { ok: false, error: "invalid_course_name" }
  }

  const period = parsePeriod(input.course_period)
  if (period === null) return { ok: false, error: "invalid_course_period" }

  return {
    ok: true,
    data: {
      name: normalizeName(input.name),
      student_registration: ra,
      course_name: course,
      course_period: period,
      coffee_break: Boolean(input.coffee_break),
    },
  }
}

export function validateProject(input: ProjectFormInput): ValidationResult<ProjectPayload> {
  if (!isValidPersonName(input.submitter_name)) {
    return { ok: false, error: "invalid_submitter_name" }
  }

  const ra = parseRa(input.submitter_registration)
  if (!ra) return { ok: false, error: "invalid_ra" }

  const projectName = input.project_name.trim()
  if (!projectName || projectName.length > TEXT_MAX) {
    return { ok: false, error: "invalid_project_name" }
  }

  const description = input.description.trim()
  if (!description || description.length > DESCRIPTION_MAX) {
    return { ok: false, error: "invalid_description" }
  }

  return {
    ok: true,
    data: {
      submitter_name: normalizeName(input.submitter_name),
      submitter_registration: ra,
      project_name: projectName,
      description,
    },
  }
}

export function validateCheckin(input: { student_registration: string }): ValidationResult<CheckinPayload> {
  const ra = parseRa(input.student_registration)
  if (!ra) return { ok: false, error: "invalid_student_registration" }
  return { ok: true, data: { student_registration: ra } }
}
