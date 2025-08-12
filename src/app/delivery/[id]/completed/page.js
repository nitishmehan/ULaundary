import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DeliverySearchFilter from "@/components/DeliverySearchFilter"
import CompletedDeliveriesList from "@/components/CompletedDeliveriesList"

export default async function CompletedDeliveriesPage({ searchParams }) {
  const user = await getCurrentUser()
  const params = await searchParams
  const search = params?.search || ""
  const hostel = params?.hostel || ""
  const floor = params?.floor || ""
  const fromDate = params?.fromDate || ""
  const toDate = params?.toDate || ""

  const completedDeliveries = await prisma.laundryProcess.findMany({
    where: {
      status: "DELIVERED",
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
      ...(floor && {
        student: { roomNumber: { startsWith: floor } }
      }),
      ...(fromDate && toDate && {
        deliveredAt: {
          gte: new Date(fromDate),
          lte: new Date(new Date(toDate).setHours(23, 59, 59, 999))
        }
      }),
      ...(fromDate && !toDate && {
        deliveredAt: { gte: new Date(fromDate) }
      }),
      ...(!fromDate && toDate && {
        deliveredAt: { lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)) }
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
    orderBy: { deliveredAt: "desc" }
  })

  const hostels = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { hostelName: true },
    distinct: ["hostelName"]
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Completed Deliveries</h1>
        <p className="text-gray-400">View your delivery history</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <DeliverySearchFilter 
          hostels={hostels.map(h => h.hostelName)} 
          currentSearch={search}
          currentHostel={hostel}
          currentFloor={floor}
          currentFromDate={fromDate}
          currentToDate={toDate}
        />

        <CompletedDeliveriesList deliveries={completedDeliveries} />
      </div>
    </div>
  )
}
