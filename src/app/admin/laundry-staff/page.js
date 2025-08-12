import { prisma } from "@/lib/prisma"
import AdminUserSearchFilter from "@/components/AdminUserSearchFilter"
import UserActionButtons from "@/components/UserActionButtons"
import { formatDate } from "@/lib/utils"

export default async function LaundryStaffPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  
  const staff = await prisma.user.findMany({
    where: {
      role: "LAUNDRY_STAFF",
      isVerified: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      })
    },
    include: {
      _count: {
        select: {
          staffProcesses: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Laundry Staff</h1>
        <p className="text-gray-400">Manage all laundry staff accounts</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <AdminUserSearchFilter 
          userType="staff"
          currentSearch={search}
        />
        
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Total Processed</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Joined</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No staff found</td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 text-white">{member.name}</td>
                    <td className="py-4 px-4 text-gray-300">{member.email}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                        {member._count.staffProcesses}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400 text-sm">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <UserActionButtons 
                        userId={member.id} 
                        userRole="LAUNDRY_STAFF"
                        userName={member.name}
                        userEmail={member.email}
                      />
                    </td>
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
