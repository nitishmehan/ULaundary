import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export default async function HistoryPage() {
  const user = await getCurrentUser()

  const history = await prisma.laundryProcess.findMany({
    where: { studentId: user.id },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Laundry History</h1>
        <p className="text-gray-400">View all your past laundry requests</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Items</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Verified</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No laundry history found
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 text-white">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "DELIVERED" ? "bg-green-500/20 text-green-300" :
                        item.status === "GENERATED" ? "bg-blue-500/20 text-blue-300" :
                        item.status === "IN_PROCESS" ? "bg-yellow-500/20 text-yellow-300" :
                        "bg-purple-500/20 text-purple-300"
                      }`}>
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white">{item.totalItems}</td>
                    <td className="py-4 px-4 text-white">{item.staffVerified ? "✓" : "✗"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
