import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CreateRequestForm from "@/components/CreateRequestForm"
import { redirect } from "next/navigation"

export default async function CreateRequestPage() {
  const user = await getCurrentUser()

  // Check if student already has an active request
  const activeRequest = await prisma.laundryProcess.findFirst({
    where: {
      studentId: user.id,
      status: { not: "DELIVERED" }
    }
  })

  if (activeRequest) {
    redirect(`/student/${user.id}/active`)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Create Laundry Request</h1>
        <p className="text-gray-400">Submit a new laundry request</p>
      </div>

      <CreateRequestForm userId={user.id} />
    </div>
  )
}
