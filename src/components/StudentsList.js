"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"

export default function StudentsList({ students }) {
  const router = useRouter()
  const [editingStudent, setEditingStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete user")
      }
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/edit-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingStudent)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update user")
        setLoading(false)
        return
      }

      setEditingStudent(null)
      router.refresh()
    } catch (error) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  if (editingStudent) {
    return (
      <div className="mt-6">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setEditingStudent(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
          <h3 className="text-2xl font-bold text-white">Edit Student</h3>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                required
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hostel</label>
              <select
                value={editingStudent.hostelName}
                onChange={(e) => setEditingStudent({ ...editingStudent, hostelName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Archimedes" className="bg-zinc-900">Archimedes</option>
                <option value="Megallen" className="bg-zinc-900">Megallen</option>
                <option value="Franklin" className="bg-zinc-900">Franklin</option>
                <option value="Aristotle" className="bg-zinc-900">Aristotle</option>
                <option value="Marco Polo" className="bg-zinc-900">Marco Polo</option>
                <option value="Armstrong" className="bg-zinc-900">Armstrong</option>
                <option value="Vasco" className="bg-zinc-900">Vasco</option>
                <option value="Columbus" className="bg-zinc-900">Columbus</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Room Number</label>
              <input
                type="text"
                required
                value={editingStudent.roomNumber}
                onChange={(e) => setEditingStudent({ ...editingStudent, roomNumber: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Laundry Number</label>
              <select
                value={editingStudent.laundryNumber}
                onChange={(e) => setEditingStudent({ ...editingStudent, laundryNumber: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num} className="bg-zinc-900">{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Hostel</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Room</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Laundry #</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Joined</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-400">No students found</td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4 text-white">{student.name}</td>
                <td className="py-4 px-4 text-gray-300">{student.email}</td>
                <td className="py-4 px-4 text-gray-300">{student.hostelName}</td>
                <td className="py-4 px-4 text-center text-gray-300">{student.roomNumber}</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                    {student.laundryNumber}
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-gray-400 text-sm">
                  {formatDate(student.createdAt)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setEditingStudent({ userId: student.id, ...student })}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      {loading ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
