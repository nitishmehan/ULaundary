import { prisma } from "@/lib/prisma"
import VerifyUserButton from "@/components/VerifyUserButton"
import { formatDate } from "@/lib/utils"

export default async function PendingVerifications() {
  const pendingUsers = await prisma.user.findMany({
    where: { isVerified: false },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Pending Verifications</h1>
        <p className="text-gray-400">Review and verify new user registrations</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        {pendingUsers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No pending verifications</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Details</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Registered</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 text-white">{user.name}</td>
                    <td className="py-4 px-4 text-gray-300">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "STUDENT" ? "bg-blue-500/20 text-blue-300" :
                        user.role === "LAUNDRY_STAFF" ? "bg-purple-500/20 text-purple-300" :
                        "bg-green-500/20 text-green-300"
                      }`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">
                      {user.role === "STUDENT" && (
                        <div>
                          <div>{user.hostelName} - Room {user.roomNumber}</div>
                          <div className="text-xs">Laundry #{user.laundryNumber}</div>
                        </div>
                      )}
                      {user.role !== "STUDENT" && "-"}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <VerifyUserButton userId={user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
