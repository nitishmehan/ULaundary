import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function StudentDashboard({ params }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "STUDENT") {
    redirect("/login")
  }

  // Verify the user is accessing their own page
  const { id } = await params
  if (user.id !== id) {
    redirect(`/student/${user.id}`)
  }

  let stats
  let activeLaundryCount = 0

  try {
    const [activeLaundry, totalLaundry, pendingIssues] = await Promise.all([
      prisma.laundryProcess.count({
        where: {
          studentId: user.id,
          status: { not: "DELIVERED" }
        }
      }),
      prisma.laundryProcess.count({
        where: { studentId: user.id }
      }),
      prisma.problem.count({
        where: {
          reportedById: user.id,
          status: { not: "RESOLVED" }
        }
      })
    ])

    stats = [
      { title: "Active Laundry", value: activeLaundry, color: "text-blue-500", bgColor: "from-blue-500/20 to-cyan-500/20" },
      { title: "Total Requests", value: totalLaundry, color: "text-cyan-500", bgColor: "from-cyan-500/20 to-blue-500/20" },
      { title: "Pending Issues", value: pendingIssues, color: "text-yellow-500", bgColor: "from-yellow-500/20 to-orange-500/20" }
    ]

    activeLaundryCount = activeLaundry
  } catch (error) {
    console.error("Dashboard error:", error)
    // Show error state or default values
    stats = [
      { title: "Active Laundry", value: 0, color: "text-blue-500", bgColor: "from-blue-500/20 to-cyan-500/20" },
      { title: "Total Requests", value: 0, color: "text-cyan-500", bgColor: "from-cyan-500/20 to-blue-500/20" },
      { title: "Pending Issues", value: 0, color: "text-yellow-500", bgColor: "from-yellow-500/20 to-orange-500/20" }
    ]
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass-effect border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user.name}!</p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Stats */}
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

        {/* Student Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass-effect border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Hostel</p>
                <p className="text-white">{user.hostelName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Room Number</p>
                <p className="text-white">{user.roomNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Laundry Number</p>
                <p className="text-white">{user.laundryNumber}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {activeLaundryCount === 0 ? (
                <a href={`/student/${user.id}/create-request`} className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
                  Create New Request
                </a>
              ) : (
                <div className="block w-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 py-3 px-4 rounded-lg text-center font-semibold">
                  You have an active request
                </div>
              )}
              <a href={`/student/${user.id}/active`} className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
                View Active Laundry
              </a>
              <a href={`/student/${user.id}/history`} className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-lg transition-all text-center font-semibold">
                View History
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
