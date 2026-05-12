export interface RegistrationPayload {
  name: string // 255 characters max
  student_registration: string // exactly 9 digits
  course_name: string // 255 characters max
  course_period: number // min 1, max 12
  coffee_break: boolean
}

export interface Registration extends RegistrationPayload {
  checked_in: boolean
}

export interface ProjectPayload {
  submitter_name: string // 255 characters max
  submitter_registration: string // exactly 9 digits
  project_name: string // 255 characters max
  description: string // 500 characters max
}

export interface Project extends ProjectPayload {
  id: number
}

export interface CheckinPayload {
  student_registration: string // exactly 9 digits
}

export interface AdminLoginPayload {
  email: string
  password: string
}

export interface AdminLoginResponse {
  token: string
}
