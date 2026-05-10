export interface RegistrationPayload {
    name: string // 255 characters max
    student_registration: number // 9 chars max
    course_name: string // 255 characters max
    course_period: number // min 1, max 12
    coffee_break: boolean // true or false
  }
  
  export interface Registration extends RegistrationPayload {
    checked_in: boolean // true or false
  }
  
  export interface ProjectPayload {
    submitter_name: string // 255 characters max
    submitter_registration: number // 9 digits
    project_name: string // 255 characters max
    description: string // 500 characters max
  }

  export interface Project extends ProjectPayload {
    id: number
  }
  
  export interface CheckinPayload {
    student_registration: number // 9 chars max
  }
  
  export interface AdminLoginPayload {
    email: string // email format, example: admin@example.com
    password: string // backend validation
  }
  
  export interface AdminLoginResponse {
    token: string // JWT token
  }