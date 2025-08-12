import { prisma } from "@/lib/prisma"
import SearchBar from "@/components/SearchBar"
import { formatDate } from "@/lib/utils"

export default async function IssuesPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  
  const issues = await prisma.problem.findMany({
    where: {
      ...(search && {
        OR: [
          { description: { contains: search, mode: "insensitive" } },
          { reportedBy: { name: { contains: search, mode: "insensitive" } } }
        ]
      })
    },
    include: {
      reportedBy: { select: { name: true, email: true, role: true } },
      laundryProcess: { 
        include: { 
          student: { select: { name: true, hostelName: true, roomNumber: true } } 
        } 
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Active Issues</h1>
        <p className="text-gray-400">Manage and resolve reported problems</p>
      </div>

      <div className="glass-effect border border-white/10 rounded-2xl p-6">
        <SearchBar placeholder="Search issues by description or reporter..." />
        
        <div className="mt-6 space-y-4">
          {issues.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No issues found</p>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        issue.status === "REPORTED" ? "bg-red-500/20 text-red-300" :
                        issue.status === "PENDING" ? "bg-yellow-500/20 text-yellow-300" :
                        "bg-green-500/20 text-green-300"
                      }`}>
                        {issue.status}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatDate(issue.createdAt)}
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{issue.description}</p>
                    <div className="text-sm text-gray-400">
                      <p>Reported by: {issue.reportedBy.name} ({issue.reportedBy.role})</p>
                      <p>Student: {issue.laundryProcess.student.name} - {issue.laundryProcess.student.hostelName} Room {issue.laundryProcess.student.roomNumber}</p>
                    </div>
                  </div>
                </div>
                {issue.resolution && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400 mb-1">Resolution:</p>
                    <p className="text-green-300">{issue.resolution}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
