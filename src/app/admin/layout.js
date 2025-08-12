import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import AdminSidebar from "@/components/AdminSidebar"

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar user={user} />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
