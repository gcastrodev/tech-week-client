import { redirect } from "next/navigation"
import { fetchAdminProjects, fetchAdminRegistrations } from "@/app/actions/admin"
import { AdminDashboardClient } from "@/app/admin/dashboard/dashboard-client"
import { isAdminSessionAuthError } from "@/lib/api-error"

export default async function AdminDashboardPage() {
  try {
    const [registrations, projects] = await Promise.all([
      fetchAdminRegistrations(),
      fetchAdminProjects(),
    ])
    return <AdminDashboardClient registrations={registrations} projects={projects} />
  } catch (err) {
    if (isAdminSessionAuthError(err)) {
      redirect("/admin/login")
    }
    throw err
  }
}
