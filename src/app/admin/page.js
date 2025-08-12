import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "ADMIN") {
    redirect("/login")
  }

  const [pendingUsers, totalStudents, totalStaff, totalDelivery, totalProblems, totalLaundry] = await Promise.all([
    prisma.user.count({ where: { isVerified: false } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "LAUNDRY_STAFF" } }),
    prisma.user.count({ where: { role: "DELIVERY_PERSON" } }),
    prisma.problem.count({ where: { status: "REPORTED" } }),
    prisma.laundryProcess.count()
  ])

  const stats = [
    { title: "Pending Verifications", value: pendingUsers, color: "text-yellow-500", bgColor: "from-yellow-500/20 to-orange-500/20" },
    { title: "Students", value: totalStudents, color: "text-cyan-500", bgColor: "from-cyan-500/20 to-blue-500/20" },
    { title: "Staff Members", value: totalStaff, color: "text-purple-500", bgColor: "from-purple-500/20 to-pink-500/20" },
    { title: "Delivery Personnel", value: totalDelivery, color: "text-green-500", bgColor: "from-green-500/20 to-emerald-500/20" },
    { title: "Active Issues", value: totalProblems, color: "text-red-500", bgColor: "from-red-500/20 to-orange-500/20" },
    { title: "Total Laundry Processes", value: totalLaundry, color: "text-indigo-500", bgColor: "from-indigo-500/20 to-purple-500/20" }
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass-effect border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage ULaundry System</p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        {/* Quick Actions */}
        <div className="glass-effect border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/admin/pending-verifications" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
              Verify Users
            </a>
            <a href="/admin/issues" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
              View Issues
            </a>
            <a href="/admin/laundry" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
              All Laundry
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
