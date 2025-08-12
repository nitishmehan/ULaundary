import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import StaffSidebar from "@/components/StaffSidebar"

export default async function StaffLayout({ children, params }) {
  const user = await getCurrentUser()

  if (!user || user.role !== "LAUNDRY_STAFF") {
    redirect("/login")
  }

  const { id } = await params
  if (user.id !== id) {
    redirect(`/staff/${user.id}`)
  }

  return (
    <div className="min-h-screen bg-black flex">
      <StaffSidebar user={user} />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
