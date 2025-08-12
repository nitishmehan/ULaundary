"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UserActionButtons({ userId, userRole, userName, userEmail, hostelName, roomNumber, laundryNumber }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

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
        setLoading(false)
      }
    } catch (error) {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "..." : "Delete"}
        </button>
      </div>

      {showEditModal && (
        <EditUserModal
          userId={userId}
          userRole={userRole}
          userName={userName}
          userEmail={userEmail}
          hostelName={hostelName}
          roomNumber={roomNumber}
          laundryNumber={laundryNumber}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

function EditUserModal({ userId, userRole, userName, userEmail, hostelName, roomNumber, laundryNumber, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    hostelName: hostelName || "",
    roomNumber: roomNumber || "",
    laundryNumber: laundryNumber || 1
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/edit-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update user")
        setLoading(false)
        return
      }

      onSuccess()
    } catch (error) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-[9999]"
      onClick={onClose}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md">
        <div 
          className="glass-effect border border-white/10 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit User</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {userRole === "STUDENT" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hostel Name</label>
                  <select
                    value={formData.hostelName}
                    onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
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
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Laundry Number</label>
                  <select
                    value={formData.laundryNumber}
                    onChange={(e) => setFormData({ ...formData, laundryNumber: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num} className="bg-zinc-900">{num}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
