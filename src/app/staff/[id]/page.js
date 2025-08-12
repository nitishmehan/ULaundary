import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function StaffDashboard() {
  const user = await getCurrentUser()

  const [pending, inProcess, completed] = await Promise.all([
    prisma.laundryProcess.count({
      where: { status: "GENERATED" }
    }),
    prisma.laundryProcess.count({
      where: { staffId: user.id, status: "IN_PROCESS" }
    }),
    prisma.laundryProcess.count({
      where: { staffId: user.id, status: { in: ["OUT_FOR_DELIVERY", "DELIVERED"] } }
    })
  ])

  const stats = [
    { title: "Pending Requests", value: pending, color: "text-yellow-500", bgColor: "from-yellow-500/20 to-orange-500/20" },
    { title: "In Process", value: inProcess, color: "text-blue-500", bgColor: "from-blue-500/20 to-cyan-500/20" },
    { title: "Completed", value: completed, color: "text-green-500", bgColor: "from-green-500/20 to-emerald-500/20" }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Staff Dashboard</h1>
        <p className="text-gray-400">Manage laundry processing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <div className="grid md:grid-cols-3 gap-4">
          <a href={`/staff/${user.id}/pending`} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
            View Pending
          </a>
          <a href={`/staff/${user.id}/in-process`} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
            In Process
          </a>
          <a href={`/staff/${user.id}/completed`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
            View Completed
          </a>
        </div>
      </div>
    </div>
  )
}
