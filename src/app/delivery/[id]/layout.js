import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DeliverySidebar from "@/components/DeliverySidebar"

export default async function DeliveryLayout({ children, params }) {
  const user = await getCurrentUser()

  if (!user || user.role !== "DELIVERY_PERSON") {
    redirect("/login")
  }

  const { id } = await params
  if (user.id !== id) {
    redirect(`/delivery/${user.id}`)
  }

  return (
    <div className="min-h-screen bg-black flex">
      <DeliverySidebar user={user} />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
