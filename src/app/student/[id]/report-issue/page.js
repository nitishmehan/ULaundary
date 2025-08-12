import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ReportIssueForm from "@/components/ReportIssueForm"

export default async function ReportIssuePage() {
  const user = await getCurrentUser()

  const activeLaundry = await prisma.laundryProcess.findMany({
    where: {
      studentId: user.id,
      status: { not: "DELIVERED" }
    },
    select: {
      id: true,
      createdAt: true,
      status: true
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Report Issue</h1>
        <p className="text-gray-400">Report a problem with your laundry</p>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <ReportIssueForm userId={user.id} activeLaundry={activeLaundry} />
      </div>
    </div>
  )
}
