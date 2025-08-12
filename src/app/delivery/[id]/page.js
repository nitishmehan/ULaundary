import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DeliveryDashboard() {
  const user = await getCurrentUser()

  const [pending, completed] = await Promise.all([
    prisma.laundryProcess.count({
      where: { 
        deliveryPersonId: user.id, 
        status: "OUT_FOR_DELIVERY" 
      }
    }),
    prisma.laundryProcess.count({
      where: { 
        deliveryPersonId: user.id, 
        status: "DELIVERED" 
      }
    })
  ])

  const stats = [
    { title: "Pending Deliveries", value: pending, color: "text-yellow-500", bgColor: "from-yellow-500/20 to-orange-500/20" },
    { title: "Completed Today", value: completed, color: "text-green-500", bgColor: "from-green-500/20 to-emerald-500/20" }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Delivery Dashboard</h1>
        <p className="text-gray-400">Manage laundry deliveries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="glass-effect border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-10`}></div>
            <div className="relative">
              <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a href={`/delivery/${user.id}/pending`} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
            View Pending
          </a>
          <a href={`/delivery/${user.id}/completed`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
            View Completed
          </a>
        </div>
      </div>
    </div>
  )
}
