import { prisma } from "@/lib/prisma"
import AdminUserSearchFilter from "@/components/AdminUserSearchFilter"
import UserActionButtons from "@/components/UserActionButtons"
import { formatDate } from "@/lib/utils"

export default async function DeliveryPersonnelPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  
  const deliveryPersonnel = await prisma.user.findMany({
    where: {
      role: "DELIVERY_PERSON",
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
          deliveryAssignments: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Delivery Personnel</h1>
        <p className="text-gray-400">Manage all delivery person accounts</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <AdminUserSearchFilter 
          userType="delivery"
          currentSearch={search}
        />
        
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Total Deliveries</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Joined</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryPersonnel.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No delivery personnel found</td>
                </tr>
              ) : (
                deliveryPersonnel.map((person) => (
                  <tr key={person.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 text-white">{person.name}</td>
                    <td className="py-4 px-4 text-gray-300">{person.email}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                        {person._count.deliveryAssignments}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400 text-sm">
                      {formatDate(person.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <UserActionButtons 
                        userId={person.id} 
                        userRole="DELIVERY_PERSON"
                        userName={person.name}
                        userEmail={person.email}
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
