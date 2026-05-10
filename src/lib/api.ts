// ATENÇÃO: O backend Rust/Axum precisa de middleware CORS configurado.
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
      const err = await res.json()
      throw new Error(err.error)
    }
  
    const text = await res.text()
    return (text ? JSON.parse(text) : undefined) as T
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
  
  export const MOCK_REGISTRATIONS: Registration[] = [
    {
      name: "Ana Paula Silva",
      student_registration: 123456789,
      course_name: "Engenharia de Software",
      course_period: 4,
      coffee_break: true,
      checked_in: false,
    },
    {
      name: "Carlos Eduardo",
      student_registration: 987654321,
      course_name: "Sistemas de Informação",
      course_period: 6,
      coffee_break: false,
      checked_in: true,
    },
    {
      name: "Mariana Costa",
      student_registration: 456123789,
      course_name: "Ciência da Computação",
      course_period: 2,
      coffee_break: true,
      checked_in: false,
    },
  ]
  
  export const MOCK_PROJECTS: Project[] = [
    {
      id: 1,
      submitter_name: "João Henrique",
      submitter_registration: 321654987,
      project_name: "AgroIA — Detecção de pragas com visão computacional",
      description: "Sistema que usa visão computacional pra identificar pragas em lavouras a partir de fotos tiradas pelo celular.",
    },
    {
      id: 2,
      submitter_name: "Fernanda Oliveira",
      submitter_registration: 654987321,
      project_name: "MedBot — Triagem inteligente em UBS",
      description: "Chatbot de IA pra triagem inicial de pacientes em unidades básicas de saúde.",
    },
  ]