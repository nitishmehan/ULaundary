import { prisma } from "@/lib/prisma"
import AdminUserSearchFilter from "@/components/AdminUserSearchFilter"
import StudentsList from "@/components/StudentsList"

export default async function StudentsPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  const hostel = params?.hostel || ""
  const laundryNumber = params?.laundryNumber || ""
  
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      isVerified: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { roomNumber: { contains: search, mode: "insensitive" } }
        ]
      }),
      ...(hostel && { hostelName: hostel }),
      ...(laundryNumber && { laundryNumber: parseInt(laundryNumber) })
    },
    orderBy: { createdAt: "desc" }
  })

  const hostels = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { hostelName: true },
    distinct: ["hostelName"]
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Students</h1>
        <p className="text-gray-400">Manage all student accounts</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <AdminUserSearchFilter 
          userType="student"
          hostels={hostels.map(h => h.hostelName)}
          currentSearch={search}
          currentHostel={hostel}
          currentLaundryNumber={laundryNumber}
        />
        
        <StudentsList students={students} />
      </div>
    </div>
  )
}
