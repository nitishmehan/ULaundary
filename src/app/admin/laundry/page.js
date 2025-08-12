import { prisma } from "@/lib/prisma"
import SearchBar from "@/components/SearchBar"
import { formatDate } from "@/lib/utils"

export default async function AllLaundryPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  
  const laundryProcesses = await prisma.laundryProcess.findMany({
    where: {
      ...(search && {
        OR: [
          { student: { name: { contains: search, mode: "insensitive" } } },
          { student: { hostelName: { contains: search, mode: "insensitive" } } }
        ]
      })
    },
    include: {
      student: { select: { name: true, email: true, hostelName: true, roomNumber: true } },
      staff: { select: { name: true } },
      deliveryPerson: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">All Laundry Processes</h1>
        <p className="text-gray-400">View and manage all laundry requests</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <SearchBar placeholder="Search by student name or hostel..." />
        
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Student</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Location</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Total Items</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Staff</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {laundryProcesses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No laundry processes found
                  </td>
                </tr>
              ) : (
                laundryProcesses.map((process) => (
                  <tr key={process.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 text-white">{process.student.name}</td>
                    <td className="py-4 px-4 text-gray-300">
                      {process.student.hostelName} - {process.student.roomNumber}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        process.status === "GENERATED" ? "bg-blue-500/20 text-blue-300" :
                        process.status === "IN_PROCESS" ? "bg-yellow-500/20 text-yellow-300" :
                        process.status === "OUT_FOR_DELIVERY" ? "bg-purple-500/20 text-purple-300" :
                        "bg-green-500/20 text-green-300"
                      }`}>
                        {process.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{process.totalItems}</td>
                    <td className="py-4 px-4 text-gray-400 text-sm">
                      {process.staff?.name || "-"}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400 text-sm">
                      {formatDate(process.createdAt)}
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
