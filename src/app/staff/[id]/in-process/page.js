import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StaffSearchFilter from "@/components/StaffSearchFilter"
import InProcessList from "@/components/InProcessList"

export default async function InProcessPage({ searchParams }) {
  const user = await getCurrentUser()
  const params = await searchParams
  const search = params?.search || ""
  const hostel = params?.hostel || ""
  const laundryNumber = params?.laundryNumber || ""
  const fromDate = params?.fromDate || ""
  const toDate = params?.toDate || ""

  const inProcessRequests = await prisma.laundryProcess.findMany({
    where: {
      status: "IN_PROCESS",
      ...(search && {
        student: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { roomNumber: { contains: search, mode: "insensitive" } }
          ]
        }
      }),
      ...(hostel && {
        student: { hostelName: hostel }
      }),
      ...(laundryNumber && {
        student: { laundryNumber: parseInt(laundryNumber) }
      }),
      ...(fromDate && toDate && {
        staffAcknowledgedAt: {
          gte: new Date(fromDate),
          lte: new Date(new Date(toDate).setHours(23, 59, 59, 999))
        }
      }),
      ...(fromDate && !toDate && {
        staffAcknowledgedAt: { gte: new Date(fromDate) }
      }),
      ...(!fromDate && toDate && {
        staffAcknowledgedAt: { lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)) }
      })
    },
    include: {
      student: {
        select: {
          name: true,
          hostelName: true,
          roomNumber: true,
          laundryNumber: true
        }
      }
    },
    orderBy: { staffAcknowledgedAt: "desc" }
  })

  const hostels = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { hostelName: true },
    distinct: ["hostelName"]
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">In Process</h1>
        <p className="text-gray-400">Mark laundry as ready for delivery</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <StaffSearchFilter 
          hostels={hostels.map(h => h.hostelName)} 
          currentSearch={search}
          currentHostel={hostel}
          currentLaundryNumber={laundryNumber}
          currentFromDate={fromDate}
          currentToDate={toDate}
        />

        <InProcessList requests={inProcessRequests} staffId={user.id} />
      </div>
    </div>
  )
}
