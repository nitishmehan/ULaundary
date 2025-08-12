import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import StudentSidebar from "@/components/StudentSidebar"

export default async function StudentLayout({ children, params }) {
  const user = await getCurrentUser()

  if (!user || user.role !== "STUDENT") {
    redirect("/login")
  }

  const { id } = await params
  if (user.id !== id) {
    redirect(`/student/${user.id}`)
  }

  return (
    <div className="min-h-screen bg-black flex">
      <StudentSidebar user={user} />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
